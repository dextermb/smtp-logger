# SMTP Logger

_This project is currently under development._

<br />
<br />
<br />

## Initial Setup

<br />

### Prerequisites

* Docker
* Docker Compose

<br />

### Development Prerequisites

* Node
* Yarn

<br />

### Setup

Clone the repository
```
git clone github.com/dextermb/smtp-logger.git
```

Build the docker image
```
docker-compose build
```

Spin up the container
```
docker-compose up
```

By default (without SSL) the SMTP logger is listening on port `25`.

<br />

---

## Configuration

Configuration options are done through either the `docker-compose.yml` or the `.env` file (which can be copied from `.env.example`). The base path for storage and custom files within the docker container is `/var/smtp-logger/custom`.

| Key                                     | Example                                     | Description                                                                                                                                                                                         |
|-----------------------------------------|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MAILSERVER_HOSTNAME`                   | `acme.com`                                  | The hostname is what the SMTP server references itself as. By default this is `os.hostname()`.                                                                                                      |
| `MAILSERVER_DEBUG`                      | `true`                                      | This enables the internal logging of the SMTP server to be enabled. By default this is disabled.                                                                                                    |
| `MAILSERVER_SSL_MIN_VERSION`            | `TLSv1.2`                                   | This changes the minimum SSL/TLS version that will be accepted by the SMTP server. By default this is `tls.DEFAULT_MIN_VERSION`.                                                                    |
| `MAILSERVER_SSL_KEY_PATH`               | `/var/smtp-logger/custom/certs/private.key` | This should be a private key file with the start line, as seen when looking at `privkey.pem` generated with `certbot`. By default this is not set.                                                  |
| `MAILSERVER_SSL_CERT_PATH`              | `/var/smtp-logger/custom/certs/server.crt`  | This should be a server certificate file with the start line, as seen when looking at `cert.pem` generated with `certbot`. By default this is not set.                                              |
| `MAILSERVER_SSL_CA_PATH`                | `/var/smtp-logger/custom/certs/ca.pem`      | This should be a certificate authority chain file with the start line, as seen when looking at `chain.pem` generated with `certbot`. By default this is not set.                                    |
| `MAILSERVER_AUTH_VALID_USERS_PATH`      | `/var/smtp-logger/custom/users.json`        | The users file should be valid JSON and defines a key of a username with a plain text password, this file is used to control which users can sign into the SMTP server. By default this is not set. |
| `MAILSERVER_AUTH_VALID_IPS_PATH`        | `/var/smtp-logger/custom/ips.json`          | The IPs file should be a valid JSON array, this file is used to control where users can sign into the SMTP server. By default this is not set.                                                      |
| `MAILSERVER_VALID_SENDER_EMAILS_PATH`   | `/var/smtp-logger/custom/senders.json`      | The senders file should be a valid JSON array, this file is used to control which emails can be sent as. By default this is not set.                                                                |
| `MAILSERVER_VALID_RECEIVER_EMAILS_PATH` | `/var/smtp-logger/custom/receivers.json`    | The receivers file should be a valid JSON array, this file is used to control where emails can be sent to. By default this is not set.                                                              |
| `MAILSERVER_REDACT_RULES_PATH`          | `/var/smtp-logger/custom/rules.json`        | The rules file should be valid JSON and defining a key of a regular expression pattern with a `scope` property. By default this is not set.                                                         |
| `MAILSERVER_REDACT_FILTERS_PATH`        | `/var/smtp-logger/custom/filters.json`      | The rules file should be valid JSON and defining a key of a regular expression pattern with `scope` and `replacement` properties. By default this is not set.                                       |

<br />

### SSL/TLS

```
smtp_1  | verbose: Starting SMTP server.
smtp_1  | info: Checking for SSL configuration.
smtp_1  | warn: SSL not configured.
smtp_1  | info: SMTP server running on port 25.
```

Setting up a secure SMTP server is easy. Simply move or copy your certificates into the `./custom[/certs]` directory and update your `.env` file. I recommend using `certbot` to install certificates onto the server. Skip the steps involving `certbot` if you already have a certificate.

<br />

#### Retrieving certificates from `certbot`

Set up an `A` record to point to your server and open port `80`.

```
apt install certbot
certbot certonly
```

After running `certbot certonly` pick the standalone web server options, enter your email address and the previously configured domain. Once `certbot` has ran through it's challenges it will give you the path of your new certificates.

```
/etc/letsencrypt/live/<domain>/privkey.pem
/etc/letsencrypt/live/<domain>/cert.pem
/etc/letsencrypt/live/<domain>/chain.pem
```

<br />

#### Moving and setting paths

Your certificates should be moved/copied into `./custom[/certs]`:

```
cp /etc/letsencrypt/live/<domain>/privkey.pem ./custom/certs/private.key
cp /etc/letsencrypt/live/<domain>/cert.pem    ./custom/certs/server.crt
cp /etc/letsencrypt/live/<domain>/chain.pem   ./custom/certs/ca.pem
```

Then update your `.env` using the base path.

```
MAILSERVER_SSL_KEY_PATH=/var/smtp-logger/custom/certs/private.key
MAILSERVER_SSL_CERT_PATH=/var/smtp-logger/custom/certs/server.crt
MAILSERVER_SSL_CA_PATH=/var/smtp-logger/custom/certs/ca.pem
```

<br />

A docker container rebuild is not required after moving your certificates, but a restart is. Once restarted you will see a message saying that SSL is enabled:

```
smtp_1  | verbose: Starting SMTP server.
smtp_1  | info: Checking for SSL configuration.
smtp_1  | info: SMTP server running on port 465.
```

<br />

### Users

```
smtp_1  | warn: 'MAILSERVER_AUTH_VALID_USERS_PATH' is not set.
smtp_1  | verbose: any@acme.com successfully authenticated.
```

When signing into the SMTP server by default any user is enabled.

#### Restricting access

To restrict which users can sign into the server create a `users.json` file within `./custom`:

```json
{
  "logs@acme.com": "reallylongandcomplexpassword"
}
```

Then update your `.env` using the base path.

```
MAILSERVER_AUTH_VALID_USERS_PATH=/var/smtp-logger/custom/users.json
```

<br />

A success message can be seen when a user successfully signs in:
```
smtp_1  | verbose: logs@acme.com successfully authenticated.
```

And an unsuccesful message can be seen when a user fails to sign in:
```
smtp_1  | verbose: bad@acme.com unsuccessfully authenticated.
```

<br />

### IPs

<br />
---

