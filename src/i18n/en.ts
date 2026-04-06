export const en = {
  sidebar: {
    search: "Search",
    projects: "Projects",
    new: "New Project",
    help: "Help",
    archive: "Archive"
  },
  header: {
    title: "WorMap Geospatial",
    explorer: "Explorer",
    projects: "Projects",
    assets: "Assets"
  },
  banner: {
    release: "New Release",
    title: "Experience WorMap v4.0",
    description: "Introducing multi-layered topographic contouring and real-time 3D terrain rendering. Optimized for large-scale enterprise spatial data management.",
    button: "Explore Layers"
  },
  filters: {
    projects: "Projects",
    archived: "Archived",
    filterBy: "Filter by",
    ownerAll: "Owner: All",
    sort: "Sort",
    lastModified: "Last Modified"
  },
  inventory: {
    title: "Project Inventory",
    activeProjects: "{count} Active Projects",
    colName: "Name",
    colOwner: "Owner",
    colStorage: "Storage Used",
    colLastModified: "Last Modified",
    colActions: "Actions"
  },
  footer: {
    newProject: "New Project",
    systemOnline: "System Online",
    used: "Used",
    modifyKml: "Modify Local KML",
    lat: "Lat",
    lon: "Lon"
  },
  popovers: {
    notifications: "No new notifications",
    settings: "Settings",
    profile: "Profile menu",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    changeLang: "한국어로 변경"
  },
  loading: {
    title: "Synchronizing Spatial Data...",
    subtitle: "Loading geography and metadata.",
    tooltips: [
      "WorMap pedestrians are affected by weather and time.",
      "Vehicle traffic volume is regulated by simulation settings.",
      "City neon signs activate automatically at night.",
      "Use WASD to move around in Walk View mode."
    ]
  },
  explorer: {
    engine: "WorMap Engine",
    title: "GLOBAL DISCOVERY",
    search: "Search coordinates or places...",
    systemStatus: "System Status",
    online: "Online",
    travelTo: "Travel to {name}",
    coordinates: "Coordinates"
  },
  scene: {
    info: {
      tag: "WorMap Live Scene",
      unknown: "Unknown Place",
      discoveryMode: "Discovery Mode",
      status: "Status",
      environment: "Environment",
      localTime: "Local Time",
      camera: "Camera",
      overview: "Overview",
      street: "Street"
    },
    status: {
      running: "Running",
      paused: "Paused"
    },
    weather: {
      clear: "Clear",
      cloudy: "Cloudy",
      rain: "Rain",
      snow: "Snow"
    },
    performance: {
      title: "Performance",
      fps: "FPS",
      frame: "Frame",
      healthy: "Healthy",
      watch: "Watch"
    }
  },
  dashboard: {
    logout: "Logout",
    serverNode: "Node-West-01",
    storageUsed: "8.2 GB",
    storageTotal: "15 GB"
  }
};

export type Dictionary = typeof en;
