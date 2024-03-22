export const useAppSettings = () => {
  let settings: { [key: string]: string } = {};
  settings['rcts_app_email'] = 'noreply@responsivecodetechnologysolutions.com';
  settings['rcts_base_url'] = 'https://cloud.responsivecodetechnologysolutions.com';
  return settings;
};
