var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCnvOn3-F3HYjF9t02E9uvh0KbW-VwhchtBvTCg_3xiB4goB0UOzUtakTmwH18NPqbQWCUkvyrfGKhEUXYnzDD8",
    "privateKey": "flVi89DxFky4rF-aEnWLTBMGHqNfke28deORQAfbxKY"
};


webPush.setVapidDetails(
    'mailto:andi.irsandi765@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/c4RLFzRxLrc:APA91bH4eZGqf9qziS_T0l-BC493aQnxwW1Z1LqW8GGwWnY85nte9N5AEU68QTVGJwnK47tF_PlNqU6Ndn6qNMF0R4F0n2riokfKBdD-ey66-2GUOyTyxTmyM_ta0oJpLCkHJ-SPMUFx",
    "keys": {
        "p256dh": "BDe6XAH0juvB8IB/bHZSsAXsW42JIAgSA/tIaqFsCBoD/G+7IlIf/sBIaFvnKfq/olboBEb6usWFnRzzRnEkxVc=",
        "auth": "fGA54uz1yulmpA28epLBhA=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '678439422852',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);