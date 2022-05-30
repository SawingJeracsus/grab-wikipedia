import axios from 'axios'
import cheerio from 'cheerio';

type Language = "uk" | "en" | "ru"

const INITIAL_WORDS = "яблуко, картина, кубік рубік";
const LANGUAGE: Language = "uk"
const AMOUNT_OF_SENTENCES = 5

console.log("Мова пошуку - "+ LANGUAGE);

const loadWikiInformation = async (word: string, lang: Language = "uk") => {
    try {
        const response = await axios.get(new URL(`https://${lang}.wikipedia.org/wiki/${word}`).toString())
       
        const html = cheerio.load(response.data)    
        const result = html('.mw-parser-output > p')
        
        return result.text()    
    } catch (error: any) {
        return null;        
    }
    
}

const parseSentences = (text: string, amount: number) => text.split(".").filter( (_, index) => index < amount ).join('.') + "."


const bootstrap = async () => {
    const result = await Promise.all(INITIAL_WORDS.split(', ').map( async (word) => {
        const text = await loadWikiInformation(word, LANGUAGE);
        if(text){
            return  {
                word,
                result: parseSentences(text, AMOUNT_OF_SENTENCES)
            }
        }
        return {
            word,
            result: "Не вдалося знайти статю в вікіпедії"
        };
    } ))
    console.log(result);

}

bootstrap()
