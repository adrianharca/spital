exports.checkForStale = function (device, server) {
    if (device.modifiedAt.getTime() < server.modifiedAt.getTime()) {
        update(device);
        return Maybe;
    }
    else if (device.modifiedAt.getTime() > server.modifiedAt.getTime())
        return server;// and send for local update
}

exports.synchronize = (objlist) => {
    objlist.array.forEach(element => {
        Meeting.findByPk(element.id).then(c => this.checkForStale(element, c))

    });

}