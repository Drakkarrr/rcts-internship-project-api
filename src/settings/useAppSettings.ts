const useAppSettings = () => {
  let settings: { [key: string]: string } = {};
  settings['rcts_app_email'] = 'noreply@rctsapp.com';
  settings['rcts_base_url'] = 'https://cloud.rctsapp.com';
  return settings;
};

export default useAppSettings;
