export const migrate = (result) => {
    const client = result.type === 'people' ? result.people : result.company;
    const newData = {
        _id: result._id,
        type: result.type,
        name: result.name,
        phone: client === null || client === void 0 ? void 0 : client.phone,
        email: client === null || client === void 0 ? void 0 : client.email,
        website: client === null || client === void 0 ? void 0 : client.website,
        country: client === null || client === void 0 ? void 0 : client.country,
        address: client === null || client === void 0 ? void 0 : client.address,
        people: result.people,
        company: result.company,
    };
    return newData;
};
