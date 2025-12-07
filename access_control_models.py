def abac(db, username, track_id):
    order = db.find_one({
        "owner": username,
        "orderId": track_id,
    })

    return order

def rbac (db, username, password):
    admin = db.find_one({
        "name": username,
        "password": password
    })

    return admin
