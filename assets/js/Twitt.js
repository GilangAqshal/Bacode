class Twitt{

    constructor(){
        this._twitts=null;
        this._loveTwitts=null;
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
    userHasLikedTwittValidate(twittId, userId){
        // proses pemeriksaan apakah user telah memberikan memberikan like
        const loveTwitts = this.getLoveTwitts();

        return loveTwitts.some(twitt => twitt.twittId === twittId && twitt.userId === userId);

    }

    getLoveTwitts(){
         if(this._loveTwitts === null){
            try{
                const storedLoveTwitts = localStorage.getItem('lovetwitts');
                this._loveTwitts = storedLoveTwitts ? JSON.parse(storedLoveTwitts) : [];
            }
            catch(error){
                return this._loveTwitts = [];
            }
        }
        return this._loveTwitts;
    }
    
    loveTwitt(loveTwittData){
        const { twittId, userId} = loveTwittData;

        if(this.userHasLikedTwittValidate(twittId, userId)){
            return {
                success: false,
                error: 'sekali aja bang, demen amat'
            }
        }

        const newLoveTwitt = {
            id: Date.now(),
            ...loveTwittData
        }

        const loveTwitts = this.getLoveTwitts();

        loveTwitts.push(newLoveTwitt);

          try{
            localStorage.setItem('lovetwitts', JSON.stringify(loveTwitts));
            return{
                success: true,
            }
        }catch(error){
            return{
                success: false,
            }
        }

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