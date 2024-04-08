import listAllSettings from './listAllSettings';
const loadSettings = async () => {
    const allSettings = {};
    try {
        const datas = await listAllSettings();
        datas.forEach(({ settingKey, settingValue }) => {
            allSettings[settingKey] = settingValue;
        });
        return allSettings;
    }
    catch (error) {
        console.error(error);
        return {};
    }
};
export default loadSettings;
