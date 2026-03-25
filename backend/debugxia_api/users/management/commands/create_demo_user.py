"""
Django management commands for debugxia_api
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a demo user for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='demo@example.com',
            help='Email for demo user'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='demo123456',
            help='Password for demo user'
        )

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'User with email {email} already exists'))
            return

        user = User.objects.create_user(
            email=email,
            username=email.split('@')[0],
            password=password,
            first_name='Demo',
            last_name='User'
        )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created demo user: {email}')
        )
