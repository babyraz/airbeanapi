import Key from '../models/key.js'

export async function getRandomKey() {
    try {
        const keys = await Key.find(); 
        if(keys.length < 1){
            throw new Error(`No keys found`);
        } else {
            return keys[Math.floor(Math.random() * keys.length)]
        }

    } catch(error){
        console.log(error.message);
        return null;
    }

}

export async function isKeyInDatabase(key){
    try {
            const keyExists = await Key.exists({ key: key});
            if(keyExists) return true;
            else throw new Error('Invalid key');
    } catch(error){
        console.log(error.message);
        return null;
    }
}