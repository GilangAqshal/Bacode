class Twitt{
    constructor(){
        this._twitts=null;
    }
    getTwitts(){
        if(this._twitts === null){
            try{
                const storedTwitts = localStorage.getItem('twitts');
                this._twitts = storedTwitts ? JSON.parse(storedTwitts) : [];
            }
            catch(error){
                return this._twitts = [];
            }
        }
        return this._twitts;
    }
    saveTwitt(twittData){

        const {twittContent,twittFeeling} = twittData;
            
        if(typeof twittContent !== 'string' || twittContent.trim() === ''){
            return{
                success: false,
                error: 'silahkan isi konten'
            }
        }
        if(twittContent.length > 150){
            return{
                success: false,
                error: 'bro stop yapping'
            }
        }

        if(typeof twittFeeling !== 'string' || twittFeeling.trim() === ''){
            return{
                success: false,
                error: 'silahkan pilih perasaan anda'
            }
        }

        const newTwitt = {
            id: Date.now(),
            isActive: true,
            ...twittData
        };

        const twitts = this.getTwitts();
        twitts.push(newTwitt);

        try{
            localStorage.setItem('twitts',JSON.stringify(twitts));
            return{
                success: true,
            }
        }catch(error){
            return{
                success: false,
            }
        }

    }

}