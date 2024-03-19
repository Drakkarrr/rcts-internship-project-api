import listAllSettings from './listAllSettings';

const loadSettings = async (): Promise<{ [key: string]: any }> => {
  const allSettings: { [key: string]: any } = {};
  try {
    const datas = await listAllSettings();
    datas.forEach(({ settingKey, settingValue }: { settingKey: string; settingValue: any }) => {
      allSettings[settingKey] = settingValue;
    });
    return allSettings;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export default loadSettings;
