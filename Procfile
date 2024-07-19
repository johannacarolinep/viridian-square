release: python manage.py makemigrations && python manage.py migrate
web: gunicorn viridian_api.wsgi
web: serve -s build