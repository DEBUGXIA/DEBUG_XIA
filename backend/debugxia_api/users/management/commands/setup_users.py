from django.core.management.base import BaseCommand
from debugxia_api.users.models import User


class Command(BaseCommand):
    help = 'Create superadmin and normal users for the application'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-superadmin',
            action='store_true',
            help='Create superadmin user (admin / admin123)',
        )
        parser.add_argument(
            '--list-users',
            action='store_true',
            help='List all users',
        )

    def handle(self, *args, **options):
        if options['create_superadmin']:
            # Create superadmin
            if User.objects.filter(username='admin').exists():
                self.stdout.write(self.style.WARNING('⚠️  Admin user already exists!'))
            else:
                User.objects.create_superuser(
                    username='admin',
                    email='admin@debugxia.com',
                    password='admin123'
                )
                self.stdout.write(self.style.SUCCESS('✅ Superadmin user created!'))
                self.stdout.write('   Username: admin')
                self.stdout.write('   Email: admin@debugxia.com')
                self.stdout.write('   Password: admin123')

        if options['list_users']:
            users = User.objects.all()
            if not users.exists():
                self.stdout.write(self.style.WARNING('❌ No users found'))
            else:
                self.stdout.write(self.style.SUCCESS(f'\n✅ Total Users: {users.count()}\n'))
                for idx, user in enumerate(users, 1):
                    role = '🔒 SUPERUSER' if user.is_superuser else '👤 Normal User'
                    self.stdout.write(f'{idx}. {user.username} ({user.email}) - {role}')

        if not options['create_superadmin'] and not options['list_users']:
            self.stdout.write(self.style.WARNING('No action specified. Use --help for options.'))
