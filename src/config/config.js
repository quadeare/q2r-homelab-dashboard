import yaml from 'js-yaml';
import { iconMap } from './iconMap';
import dashboardYaml from './dashboard.yaml?raw';

// Parse the YAML file
const config = yaml.load(dashboardYaml);

// Transform services data by mapping icon names to icon components
export const servicesData = config.services.map(service => ({
  ...service,
  icon: iconMap[service.icon]
}));

// Transform hosted websites data by mapping icon names to icon components
export const hostedWebsites = config.hostedWebsites.map(website => ({
  ...website,
  icon: iconMap[website.icon]
}));
