import moment from "moment";

export const accountNumber = "EC_TEST";

export const timeFormated = (val) => {
    if(val){
        const formattedTime = moment(val).utcOffset(5).format('YYYY-MM-DD HH:mm:ss');
        return formattedTime
    }else{
        return ''
    }
}