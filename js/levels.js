// ==========================================
// BÖLÜM VERİLERİ (LEVELS)
// ==========================================
export const LEVELS = [
    { 
        id: 1, 
        name: "İlk Adımlar", 
        world: 'grass', 
        story: "Kahramanımız yolculuğuna başlıyor. Basit zıplamalarla ilerlemeyi öğrenmeli.",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:800,h:50}, 
            {x:300,y:320,w:100,h:15}
        ], 
        coins: [{x:350,y:280,r:10}], 
        portal: {x:720,y:350,w:40,h:50} 
    },
    { 
        id: 2, 
        name: "Karanlık Tünel", 
        world: 'cave', 
        story: "Derin mağaralarda kayboldun. Işık azalıyor ve dar geçitlerden geçmen gerekiyor. Dikkatli ol!",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:200,h:50}, 
            {x:300,y:320,w:80,h:15}, 
            {x:500,y:240,w:80,h:15}, 
            {x:700,y:160,w:100,h:15}
        ], 
        coins: [
            {x:340,y:280,r:10}, 
            {x:540,y:200,r:10}
        ], 
        portal: {x:730,y:110,w:40,h:50} 
    },
    { 
        id: 3, 
        name: "Buzul Kaydırak", 
        world: 'ice', 
        story: "Buzul vadisinde ayakların kayıyor! Hareketli platformları kullanarak karşıya geçmelisin. Kaygan zemine dikkat!",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:200,h:50}, 
            {x:600,y:400,w:200,h:50}
        ], 
        movingPlatforms: [
            {x:250,y:350,w:80,h:15,type:'horizontal',speed:2,minX:200,maxX:500}
        ], 
        coins: [{x:400,y:300,r:10}], 
        portal: {x:720,y:350,w:40,h:50} 
    },
    { 
        id: 4, 
        name: "Yerçekimsiz Uzay", 
        world: 'space', 
        story: "Uzay boşluğunda yerçekimi yok! Zıplamaların daha yükseğe çıkacak ama kontrol zorlaşacak.",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:150,h:50}, 
            {x:400,y:300,w:100,h:15}, 
            {x:650,y:200,w:100,h:15}
        ], 
        coins: [
            {x:450,y:250,r:10}, 
            {x:700,y:150,r:10}
        ], 
        portal: {x:680,y:150,w:40,h:50} 
    },
    { 
        id: 5, 
        name: "Lavdan Kaçış", 
        world: 'lava', 
        story: "Lav nehirleri yükseliyor! Kırılabilir blokları kullanarak zamanında ilerlemezsen yanarsın!",
        startPos: {x:50, y:300}, 
        platforms: [
            {x:0,y:350,w:150,h:15}, 
            {x:250,y:300,w:80,h:15}, 
            {x:450,y:250,w:80,h:15}, 
            {x:650,y:200,w:100,h:15}
        ], 
        breakableBlocks: [
            {x:350,y:250,w:60,h:15,breakTime:60}
        ], 
        coins: [{x:290,y:260,r:10}], 
        portal: {x:680,y:150,w:40,h:50} 
    },
    { 
        id: 6, 
        name: "Rüzgar Vadisi", 
        world: 'grass', 
        story: "Güçlü rüzgarlar seni havaya uçuruyor! Rüzgar bölgelerini kullanarak yüksek platformlara ulaş.",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:200,h:50}, 
            {x:600,y:250,w:150,h:15}
        ], 
        windZones: [
            {x:200,y:100,w:300,h:300,forceX:0,forceY:-0.5}
        ], 
        coins: [{x:350,y:150,r:10}], 
        portal: {x:650,y:200,w:40,h:50} 
    },
    { 
        id: 7, 
        name: "Dikenli Mağara", 
        world: 'cave', 
        story: "Dikenlerle dolu bir mağara! En ufak hatada canını kaybedersin. Çok dikkatli zıplamalısın.",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:250,h:50}, 
            {x:350,y:350,w:100,h:15}, 
            {x:550,y:300,w:100,h:15}, 
            {x:700,y:250,w:100,h:15}
        ], 
        spikes: [
            {x:260,y:380,w:30,h:20,dir:'up'},
            {x:300,y:380,w:30,h:20,dir:'up'},
            {x:470,y:330,w:30,h:20,dir:'up'}
        ], 
        portal: {x:730,y:200,w:40,h:50} 
    },
    { 
        id: 8, 
        name: "Düşman Kampı", 
        world: 'grass', 
        story: "Düşmanlar bölgeyi ele geçirmiş! Üzerlerine zıplayarak onları etkisiz hale getirmelisin.",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:800,h:50}
        ], 
        enemies: [
            {x:250,y:370,w:30,h:30,speed:1.5,dir:1,minX:200,maxX:400,col:'#8e44ad'},
            {x:550,y:370,w:30,h:30,speed:2,dir:-1,minX:500,maxX:700,col:'#e67e22'}
        ], 
        portal: {x:730,y:350,w:40,h:50} 
    },
    { 
        id: 9, 
        name: "Hangi Kapı?", 
        world: 'cave', 
        story: "Sahte portallar seni tuzağa düşürmek için bekliyor! Gerçek portalı bulmalısın.",
        startPos: {x:50, y:350}, 
        platforms: [
            {x:0,y:400,w:800,h:50}
        ], 
        fakePortals: [
            {x:300,y:350,w:40,h:50},
            {x:500,y:350,w:40,h:50}
        ], 
        portal: {x:720,y:350,w:40,h:50} 
    }
];
