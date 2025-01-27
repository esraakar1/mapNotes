// status durumunu belirleyen fonksiyon 
import {goToIcon, homeIcon, jobIcon, parkIcon} from "./constants.js";

export const getStatus = (status) => {
    switch(status) {
        case "goto":
            return "ziyaret";
         case "home":
            return "Ev";
        case "park":
            return "park";
         case "job":
            return "iş";
        default:
            return "Diğer";       
    }
};

// status değerine bağlı olarak icon belirleyen fonksiyon 

export const getIcon = (status) => {
    switch(status) {
        case "goto":
            return goToIcon;
         case "home":
            return homeIcon;
        case "park":
            return parkIcon;
         case "job":
            return jobIcon;
        default:
            return null;       
    }
};