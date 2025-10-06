For use on a linux server

  cd /var/www/systemmonitor/

  nano systemmonitor.wsgi

        import sys
        import os
        from pathlib import Path

        sys.path.insert(0, str(Path(__file__).resolve().parent))

        from app import app as application

  save and exit

Configure Apache virtual host

  sudo nano /etc/apache2/sites-available/systemmonitor.conf

    <VirtualHost *:80>
      ServerName [your_server_ip_or_domain] 

      WSGIDaemonProcess systemmonitor python-path=/var/www/systemmonitor
      WSGIScriptAlias / /var/www/systemmonitor/systemmonitor.wsgi

      <Directory /var/www/systemmonitor>
          Require all granted
      </Directory>

      Alias /static /var/www/systemmonitor/static
      <Directory /var/www/systemmonitor/static>
          Require all granted
      </Directory>

      ErrorLog ${APACHE_LOG_DIR}/systemmonitor-error.log
      CustomLog ${APACHE_LOG_DIR}/systemmonitor-access.log combined
    </VirtualHost>

  save and exit

Enable and restart apache

  sudo a2ensite systemmonitor.conf
  sudo systemctl reload apache2
  sudo systemctl restart apache

Go to site
