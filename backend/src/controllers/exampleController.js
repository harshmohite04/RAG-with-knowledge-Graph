exports.getExample = (req, res) => {
    res.status(200).json({
        message: 'This is an example response from the controller',
        timestamp: new Date()
    });
};

exports.createExample = (req, res) => {
    const { data } = req.body;
    res.status(201).json({
        message: 'Data received successfully',
        receivedData: data
    });
};
