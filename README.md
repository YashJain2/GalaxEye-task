# GalaxEye-AOI-Application

### Project Description

A user comes to a console which has a base-map and an option to draw an AOI (Area of Interest). Upon selecting and area they will be presented with all the tiles (pre configured satellite image’s metadata) which are intersecting that AOI
Link to detailed description: https://galaxeye-space.notion.site/GalaxEye-problem-statement-Full-Stack-Developer-5f103d95da1347649b6c441321ab1668

### Pre-requisites
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

### Trobleshooting Ways

- Check if the ports are already in use, if so kill the function running on ports or change the ports wherever needed
- Clean the docker images and rebuild using the same command
- Stop & rerun to find logs and debug 
