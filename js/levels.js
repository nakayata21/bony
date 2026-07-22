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
        story: "Mağaranın derinliklerinde tuzaklar çoğalıyor. Sadece zemin değil, duvarlar ve tavan bile ölümcül sivri uçlarla dolu. Dikkatli adımlar ve doğru zamanlama seni kurtaracak. Acele etme, her hareketin hayatını belirleyecek.",
        startPos: {x:50, y:380}, 
        platforms: [
            // Başlangıç alanı
            {x:0, y:400, w:120, h:50},
            // İlk yükselti
            {x:160, y:370, w:80, h:20},
            // İkinci yükselti
            {x:280, y:340, w:70, h:20},
            // Üçüncü yükselti
            {x:390, y:310, w:70, h:20},
            // Dikenli geçit öncesi güvenli alan
            {x:500, y:310, w:100, h:20},
            // Uzun köprü (dikenli)
            {x:650, y:280, w:150, h:20},
            // Yükselen merdivenler
            {x:850, y:250, w:60, h:20},
            {x:950, y:210, w:60, h:20},
            {x:1050, y:170, w:80, h:20},
            // Dar tünel bölümü
            {x:1180, y:170, w:120, h:20},
            // Son sıçrama platformu
            {x:1350, y:140, w:100, h:20},
            // Bitiş platformu
            {x:1500, y:140, w:120, h:20}
        ],
        spikes: [
            // Başlangıç sonrası ilk diken serisi
            {x:130, y:380, w:25, h:20, dir:'up'},
            {x:250, y:380, w:25, h:20, dir:'up'},
            // Platform aralarındaki dikenler
            {x:240, y:340, w:20, h:15, dir:'up'},
            {x:360, y:310, w:20, h:15, dir:'up'},
            // Köprü üzerindeki tavandan sarkan dikenler
            {x:680, y:260, w:25, h:20, dir:'down'},
            {x:730, y:260, w:25, h:20, dir:'down'},
            {x:780, y:260, w:25, h:20, dir:'down'},
            // Merdivenlerde yan dikenler
            {x:840, y:230, w:15, h:25, dir:'right'},
            {x:940, y:190, w:15, h:25, dir:'right'},
            // Tünel bölümünde yoğun dikenler
            {x:1200, y:150, w:30, h:20, dir:'down'},
            {x:1240, y:150, w:30, h:20, dir:'down'},
            {x:1280, y:150, w:30, h:20, dir:'down'},
            // Son engel
            {x:1460, y:120, w:25, h:20, dir:'down'}
        ],
        coins: [
            {x:190, y:330, r:10},
            {x:310, y:300, r:10},
            {x:420, y:270, r:10},
            {x:540, y:270, r:10},
            {x:700, y:240, r:10},
            {x:750, y:240, r:10},
            {x:880, y:210, r:10},
            {x:980, y:170, r:10},
            {x:1100, y:130, r:10},
            {x:1240, y:130, r:10},
            {x:1390, y:100, r:10},
            {x:1550, y:100, r:10}
        ],
        portal: {x:1580, y:90, w:40, h:50} 
    },
    { 
        id: 8, 
        name: "Düşman Kampı", 
        world: 'grass', 
        story: "Düşmanlar bölgeyi ele geçirmiş! Uzun bir kamp alanı boyunca ilerlemeli, her bir düşmanı doğru zamanda ezerek etkisiz hale getirmelisin. Aceleci davranırsan sonun hüsran olur.",
        startPos: {x:50, y:350}, 
        platforms: [
            // Başlangıç zemini
            {x:0, y:400, w:150, h:50},
            // İlk yükselti ve düşman alanı
            {x:200, y:380, w:100, h:20},
            {x:350, y:360, w:100, h:20},
            // Orta alan - çoklu düşman
            {x:500, y:380, w:150, h:20},
            // Yükselen platformlar
            {x:700, y:340, w:80, h:20},
            {x:850, y:300, w:80, h:20},
            // Son düzlük
            {x:1000, y:300, w:150, h:20}
        ], 
        enemies: [
            // İlk dalga
            {x:220, y:350, w:30, h:30, speed:1.5, dir:1, minX:200, maxX:280, col:'#8e44ad'},
            {x:370, y:330, w:30, h:30, speed:2, dir:-1, minX:350, maxX:430, col:'#e67e22'},
            // Orta alandaki devriyeler
            {x:520, y:350, w:30, h:30, speed:2.5, dir:1, minX:500, maxX:600, col:'#c0392b'},
            {x:600, y:350, w:30, h:30, speed:2, dir:-1, minX:550, maxX:650, col:'#d35400'},
            // Son savunma hattı
            {x:720, y:310, w:30, h:30, speed:1.8, dir:1, minX:700, maxX:760, col:'#8e44ad'},
            {x:870, y:270, w:30, h:30, speed:3, dir:-1, minX:850, maxX:910, col:'#e74c3c'}
        ],
        coins: [
            {x:250, y:310, r:10},
            {x:400, y:290, r:10},
            {x:550, y:310, r:10},
            {x:600, y:310, r:10},
            {x:740, y:270, r:10},
            {x:890, y:230, r:10},
            {x:1050, y:260, r:10},
            {x:1100, y:260, r:10}
        ],
        portal: {x:1120, y:250, w:40, h:50} 
    },
    { 
        id: 9, 
        name: "Son Sınav: Hangi Kapı?", 
        world: 'cave', 
        story: "Büyük final öncesi son zeka testi. Önünde üç kapı var; ikisi seni başa döndürecek tuzaklar, sadece biri gerçek çıkış. Sabırlı ol, gözlemle ve doğru kararı ver. Tüm yolculuğun bu ana kadardı.",
        startPos: {x:50, y:350}, 
        platforms: [
            // Başlangıç alanı
            {x:0, y:400, w:150, h:50},
            // Tuzaklara giden köprü
            {x:200, y:380, w:600, h:20},
            // Gerçek portal için gizli üst yol
            {x:300, y:280, w:100, h:20},
            {x:450, y:220, w:100, h:20},
            {x:600, y:180, w:200, h:20}
        ], 
        fakePortals: [
            // İlk sahte (göze çarpan)
            {x:350, y:330, w:40, h:50},
            // İkinci sahte (biraz daha sinsi)
            {x:550, y:330, w:40, h:50}
        ],
        coins: [
            // Riskli altınlar (tuzakların yanında)
            {x:370, y:290, r:10},
            {x:570, y:290, r:10},
            // Üst yoldaki güvenli altınlar
            {x:350, y:240, r:10},
            {x:500, y:180, r:10},
            {x:650, y:140, r:10},
            {x:750, y:140, r:10}
        ],
        portal: {x:760, y:130, w:40, h:50} 
    }
];
