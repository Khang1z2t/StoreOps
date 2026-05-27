Build Docker image:

```bash
docker build -t storeops-backend ./backend
```

Run Docker container:

```bash
docker run --rm -p 8080:8080 --env-file backend/.env storeops-backend
```