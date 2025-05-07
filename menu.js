const menuItems = [
    {
        id: 1,
        name: "泰式风味虾",
        description: "香辣可口的泰式经典，嫩滑虾配上麻辣酱汁和肉末",
        tags: ["spicy", "pork", "stir_fry", "rice", "family"],
        score: {
            spicy: 9, sweet: 1, sour: 0, light: 0,
            rice: 8, noodle: 2, bun: 0, potato: 0,
            pork: 8, beef: 0, chicken: 0, fish: 0, veg: 5,
            stir_fry: 9, steam: 0, stew: 0, fry: 0, bake: 0,
            quick: 5, family: 8, friends: 7, business: 5
        }
    },
    {
        id: 2,
        name: "和牛肉酱面",
        description: "和牛肉酱面，香辣爽口，风味独特",
        tags: ["spicy", "chicken", "stir_fry", "rice", "family"],
        score: {
            spicy: 7, sweet: 2, sour: 1, light: 0,
            rice: 9, noodle: 2, bun: 0, potato: 0,
            pork: 0, beef: 0, chicken: 9, fish: 0, veg: 0,
            stir_fry: 9, steam: 0, stew: 0, fry: 0, bake: 0,
            quick: 6, family: 8, friends: 7, business: 7
        }
    },
    {
        id: 3,
        name: "榴莲披萨",
        description: "榴莲披萨，外酥里嫩，风味独特",
        tags: ["sweet", "sour", "pork", "fry", "rice", "friends"],
        score: {
            spicy: 0, sweet: 8, sour: 7, light: 0,
            rice: 9, noodle: 1, bun: 0, potato: 0,
            pork: 9, beef: 0, chicken: 0, fish: 0, veg: 0,
            stir_fry: 0, steam: 0, stew: 0, fry: 9, bake: 0,
            quick: 4, family: 7, friends: 9, business: 8
        }
    },
    {
        id: 4,
        name: "肉眼牛排",
        description: "肉眼牛排，鲜嫩多汁，风味独特",
        tags: ["light", "fish", "steam", "rice", "family"],
        score: {
            spicy: 0, sweet: 0, sour: 0, light: 9,
            rice: 9, noodle: 0, bun: 0, potato: 0,
            pork: 0, beef: 0, chicken: 0, fish: 9, veg: 0,
            stir_fry: 0, steam: 9, stew: 0, fry: 0, bake: 0,
            quick: 3, family: 9, friends: 7, business: 8
        }
    },
    {
        id: 5,
        name: "柠檬烤鸡",
        description: "柠檬烤鸡，鲜嫩多汁，风味独特",
        tags: ["spicy", "beef", "stew", "noodle", "quick"],
        score: {
            spicy: 6, sweet: 2, sour: 0, light: 0,
            rice: 0, noodle: 9, bun: 0, potato: 0,
            pork: 0, beef: 9, chicken: 0, fish: 0, veg: 0,
            stir_fry: 0, steam: 0, stew: 9, fry: 0, bake: 0,
            quick: 9, family: 7, friends: 6, business: 3
        }
    },
    {
        id: 6,
        name: "秘制汉堡",
        description: "秘制汉堡，鲜嫩多汁，风味独特",
        tags: ["light", "pork", "steam", "bun", "quick"],
        score: {
            spicy: 0, sweet: 1, sour: 0, light: 8,
            rice: 0, noodle: 0, bun: 9, potato: 0,
            pork: 9, beef: 0, chicken: 0, fish: 0, veg: 0,
            stir_fry: 0, steam: 9, stew: 0, fry: 0, bake: 0,
            quick: 9, family: 7, friends: 6, business: 5
        }
    },
    {
        id: 7,
        name: "法式鹅肝饭",
        description: "法式鹅肝饭，鲜嫩多汁，风味独特",
        tags: ["light", "beef", "stew", "potato", "family"],
        score: {
            spicy: 2, sweet: 1, sour: 0, light: 7,
            rice: 6, noodle: 0, bun: 0, potato: 9,
            pork: 0, beef: 9, chicken: 0, fish: 0, veg: 0,
            stir_fry: 0, steam: 0, stew: 9, fry: 0, bake: 0,
            quick: 5, family: 9, friends: 7, business: 5
        }
    },
    {
        id: 8,
        name: "法式烤羊排",
        description: "法式烤羊排，鲜嫩多汁，风味独特",
        tags: ["spicy", "veg", "stir_fry", "rice", "quick"],
        score: {
            spicy: 7, sweet: 0, sour: 0, light: 2,
            rice: 8, noodle: 0, bun: 0, potato: 0,
            pork: 1, beef: 0, chicken: 0, fish: 0, veg: 9,
            stir_fry: 9, steam: 0, stew: 0, fry: 0, bake: 0,
            quick: 9, family: 8, friends: 6, business: 6
        }
    },
    {
        id: 9,
        name: "炭烤三文鱼",
        description: "炭烤三文鱼，鲜嫩多汁，风味独特",
        tags: ["spicy", "sweet", "sour", "veg", "stir_fry", "rice"],
        score: {
            spicy: 5, sweet: 4, sour: 3, light: 0,
            rice: 9, noodle: 0, bun: 0, potato: 0,
            pork: 0, beef: 0, chicken: 0, fish: 0, veg: 9,
            stir_fry: 9, steam: 0, stew: 0, fry: 0, bake: 0,
            quick: 7, family: 8, friends: 6, business: 5
        }
    },
    {
        id: 10,
        name: "提拉米苏",
        description: "提拉米苏，鲜嫩多汁，风味独特",
        tags: ["light", "sweet", "chicken", "bake", "business"],
        score: {
            spicy: 0, sweet: 5, sour: 0, light: 6,
            rice: 5, noodle: 0, bun: 7, potato: 0,
            pork: 0, beef: 0, chicken: 9, fish: 0, veg: 0,
            stir_fry: 0, steam: 0, stew: 0, fry: 0, bake: 9,
            quick: 0, family: 6, friends: 8, business: 10
        }
    }
]; 