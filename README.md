# GalaxEye-AOI-Application

###Pre-requisites
- Docker Desktop
- Node
- React

Pull the code from the github repository

```
git pull https://github.com/YashJain2/GalaxEye-task.git
```

```
Run the docker desktop
```

Run the docker compose command to create image for frontend, backend & postgressDB
```
docker-compose up --build -d
```

###Trobleshooting Ways

- Check if the ports are already in use, if so kill the function running on ports or change the ports wherever needed
- Clean the docker images and rebuild using the same command
- Stop & rerun to find logs and debug
