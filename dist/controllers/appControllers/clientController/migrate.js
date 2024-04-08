export const migrate = (result) => {
    const client = result.type === 'people' ? result.people : result.company;
    const newData = {
        _id: result._id,
        type: result.type,
        name: result.name,
        phone: client?.phone,
        email: client?.email,
        website: client?.website,
        country: client?.country,
        address: client?.address,
        people: result.people,
        company: result.company,
    };
    return newData;
};
//# sourceMappingURL=migrate.js.map