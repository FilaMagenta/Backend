# Filà Magenta - Backend

[![Dev Docker size](https://img.shields.io/docker/image-size/arnyminerz/filamagenta/development?label=Dev%20image%20size&logo=docker&style=for-the-badge)](https://hub.docker.com/repository/docker/arnyminerz/filamagenta)

## Environment Variables
### `PROPERTIES_FILE`
If defined, specifies the location of the secrets properties file.

## Required environment
### Encryption keys
You can use a website such as [cryptotools.net](https://cryptotools.net/rsagen) to generate a RSA keypair with length
`2048`. Then store the keys in `keys/private.key` and `keys/public.key`.

### Secrets
A file called `local.properties` must be placed on the root of the project. The contents are:
```properties
woo.server=http://<server>:<port>
woo.consumer_key=...
woo.consumer_secret=...
```
