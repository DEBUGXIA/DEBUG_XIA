from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import requests
import json
import subprocess
import tempfile
import os
import sys

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_token(request):
    """Debug endpoint to check token and auth"""
    auth_header = request.META.get('HTTP_AUTHORIZATION', 'No Authorization header')
    
    return JsonResponse({
        'auth_header': auth_header[:50] + '...' if len(auth_header) > 50 else auth_header,
        'user': str(request.user),
        'is_authenticated': request.user.is_authenticated,
        'method': request.method,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_protected(request):
    """Protected endpoint for testing"""
    return JsonResponse({
        'user_id': request.user.id,
        'user_email': request.user.email,
        'is_authenticated': request.user.is_authenticated,
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_code(request):
    """Analyze code using Ollama Mistral"""
    try:
        data = request.data
        code = data.get('code', '')
        language = data.get('language', 'unknown')
        
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)
        
        # Ollama Mistral setup
        OLLAMA_API_URL = 'http://localhost:11434/api/generate'
        
        prompt = f"""You are an expert code analyzer. Analyze this {language} code and provide:

1. **Error Analysis** - List any errors, bugs, or issues
2. **Improvements** - Suggest improvements and optimizations  
3. **Best Practices** - Recommend best practices for this code

Code to analyze:
```{language}
{code}
```

Provide a comprehensive analysis."""
        
        response = requests.post(
            OLLAMA_API_URL,
            headers={'Content-Type': 'application/json'},
            json={
                'model': 'mistral',
                'prompt': prompt,
                'stream': False
            },
            timeout=300
        )
        
        if response.status_code != 200:
            return JsonResponse(
                {'error': f'Ollama API error: {response.text}'}, 
                status=response.status_code
            )
        
        result = response.json()
        analysis = result['response']
        
        return JsonResponse({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def execute_code(request):
    """Execute code and return output or errors"""
    try:
        data = request.data
        code = data.get('code', '')
        language = data.get('language', 'Python')
        
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)
        
        # Create a temporary file for the code
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix=get_file_extension(language)) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            # Execute based on language
            if language == 'Python':
                result = subprocess.run(
                    [sys.executable, temp_file],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
            elif language == 'Java':
                # Check if javac is available
                check_javac = subprocess.run(['javac', '-version'], capture_output=True)
                if check_javac.returncode != 0:
                    # If compiler not available, analyze code instead
                    return analyze_code_with_mistral(code, language, "Java compiler not found")
                
                # Compile and run Java
                class_name = temp_file.split('/')[-1].split('\\')[-1].replace('.java', '')
                compile_result = subprocess.run(
                    ['javac', temp_file],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if compile_result.returncode != 0:
                    return JsonResponse({
                        'success': False,
                        'output': '',
                        'error': f"❌ Java Compilation Error:\n{compile_result.stderr}"
                    })
                
                temp_dir = os.path.dirname(temp_file)
                result = subprocess.run(
                    ['java', '-cp', temp_dir, class_name],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
            elif language in ['C', 'C++']:
                # Check if compiler is available
                compiler = 'g++' if language == 'C++' else 'gcc'
                check_compiler = subprocess.run([compiler, '--version'], capture_output=True)
                if check_compiler.returncode != 0:
                    # If compiler not available, analyze code instead
                    return analyze_code_with_mistral(code, language, "Compiler not found")
                
                # Compile and run C/C++
                if sys.platform == 'win32':
                    executable = temp_file.replace(get_file_extension(language), '.exe')
                else:
                    executable = temp_file.replace(get_file_extension(language), '')
                
                compile_result = subprocess.run(
                    [compiler, temp_file, '-o', executable],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                if compile_result.returncode != 0:
                    return JsonResponse({
                        'success': False,
                        'output': '',
                        'error': f"❌ {language} Compilation Error:\n{compile_result.stderr}"
                    })
                
                result = subprocess.run(
                    [executable],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
            else:
                return JsonResponse({'error': f'Unsupported language: {language}'}, status=400)
            
            # Return results
            if result.returncode == 0:
                return JsonResponse({
                    'success': True,
                    'output': result.stdout if result.stdout else '✅ Program executed successfully (no output)',
                    'error': ''
                })
            else:
                return JsonResponse({
                    'success': False,
                    'output': result.stdout,
                    'error': f"❌ Runtime Error:\n{result.stderr}" if result.stderr else "❌ Program failed with no error message"
                })
        
        finally:
            # Clean up temp files
            try:
                os.unlink(temp_file)
                if language in ['C', 'C++']:
                    if sys.platform == 'win32':
                        executable = temp_file.replace(get_file_extension(language), '.exe')
                    else:
                        executable = temp_file.replace(get_file_extension(language), '')
                    if os.path.exists(executable):
                        os.unlink(executable)
            except:
                pass
    
    except subprocess.TimeoutExpired:
        return JsonResponse({
            'success': False,
            'output': '',
            'error': '⏱️ Code execution timed out (10 seconds limit). Your code might be stuck in an infinite loop.'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'output': '',
            'error': f'❌ Error: {str(e)}'
        })


def get_file_extension(language):
    """Get file extension based on language"""
    extensions = {
        'Python': '.py',
        'Java': '.java',
        'C': '.c',
        'C++': '.cpp'
    }
    return extensions.get(language, '.txt')


def analyze_code_with_mistral(code, language, reason=""):
    """Analyze code using Mistral and return explanation"""
    try:
        OLLAMA_API_URL = 'http://localhost:11434/api/generate'
        
        prompt = f"""Analyze this {language} code and explain what it does:

CODE:
```{language}
{code}
```

Provide a brief explanation of:
1. What this code does
2. Expected output (what will it print/display)
3. Any potential issues"""
        
        try:
            response = requests.post(
                OLLAMA_API_URL,
                headers={'Content-Type': 'application/json'},
                json={
                    'model': 'mistral',
                    'prompt': prompt,
                    'stream': False
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                analysis = result.get('response', '')
                return JsonResponse({
                    'success': True,
                    'output': f"📊 Code Analysis:\n{analysis}",
                    'error': ''
                })
            else:
                # Ollama error
                return JsonResponse({
                    'success': False,
                    'output': '',
                    'error': f'❌ Make sure Ollama is running with mistral model\nError: {response.text[:100]}'
                })
        except requests.exceptions.ConnectionError:
            # Ollama not running - provide basic analysis
            lines = code.split('\n')
            basic_analysis = f"""📊 Basic Code Analysis (Ollama not connected):

Lines of code: {len(lines)}
Language: {language}
Note: To get AI analysis, make sure Ollama is running with 'ollama serve'

Your code appears to be syntactically valid {language} code.
To see AI-powered analysis, run: ollama serve"""
            
            return JsonResponse({
                'success': True,
                'output': basic_analysis,
                'error': ''
            })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'output': '',
            'error': f'Error during analysis: {str(e)}'
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_execution(request):
    """Analyze code execution output/error using Mistral"""
    try:
        data = request.data
        code = data.get('code', '')
        language = data.get('language', 'unknown')
        output = data.get('output', '')
        error = data.get('error', '')
        
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)
        
        # Build analysis prompt
        execution_result = ""
        if error:
            execution_result = f"ERROR:\n{error}"
        elif output:
            execution_result = f"OUTPUT:\n{output}"
        else:
            execution_result = "No output"
        
        prompt = f"""You are an expert code analyzer and debugger. A user ran this {language} code and got this result.

CODE:
```{language}
{code}
```

EXECUTION RESULT:
{execution_result}

Please provide:
1. **What's happening**: Explain what the code does and what happened during execution
2. **Error Analysis** (if there's an error): What went wrong and why?
3. **Output Analysis** (if there's output): What does this output mean?
4. **Suggestions**: How to fix it or improve the code?

Be helpful, clear, and concise."""
        
        # Call Ollama Mistral
        OLLAMA_API_URL = 'http://localhost:11434/api/generate'
        
        response = requests.post(
            OLLAMA_API_URL,
            headers={'Content-Type': 'application/json'},
            json={
                'model': 'mistral',
                'prompt': prompt,
                'stream': False
            },
            timeout=300
        )
        
        if response.status_code != 200:
            return JsonResponse({
                'success': False,
                'analysis': f'Error from Mistral: {response.text}'
            })
        
        result = response.json()
        analysis = result['response']
        
        return JsonResponse({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'analysis': f'Error: {str(e)}'
        })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def execution_stats(request):
    """Get or update execution statistics for logged-in user"""
    from debugxia_api.users.models import ExecutionStats
    
    if request.method == 'GET':
        # Get user's execution stats
        try:
            stats, created = ExecutionStats.objects.get_or_create(user=request.user)
            return JsonResponse({
                'success': True,
                'stats': {
                    'total_executions': stats.total_executions,
                    'successful_executions': stats.successful_executions,
                    'failed_executions': stats.failed_executions,
                    'average_execution_time': round(stats.average_execution_time, 2),
                    'success_rate': stats.get_success_rate(),
                    'languages_used': stats.languages_used,
                    'last_execution_date': stats.last_execution_date
                }
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    elif request.method == 'POST':
        # Update execution stats
        try:
            data = request.data
            success = data.get('success', False)
            execution_time = data.get('execution_time', 0)
            language = data.get('language', 'Unknown')
            
            stats, created = ExecutionStats.objects.get_or_create(user=request.user)
            stats.update_stats(success, execution_time, language)
            
            return JsonResponse({
                'success': True,
                'stats': {
                    'total_executions': stats.total_executions,
                    'successful_executions': stats.successful_executions,
                    'failed_executions': stats.failed_executions,
                    'average_execution_time': round(stats.average_execution_time, 2),
                    'success_rate': stats.get_success_rate(),
                    'languages_used': stats.languages_used,
                    'last_execution_date': stats.last_execution_date
                }
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
