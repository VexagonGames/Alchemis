export const SEASON = {
    SPRING: 1,
    SUMMER: 2,
    AUTUMN: 3,
    WINTER: 0
};

export class SeasonManager {
    constructor() {
        this.day = 1;
        this.season = SEASON.SPRING;
    }

    NextDay() {
        this.day++;
        
        if(this.day > 30) {
            this.season = (this.season+1)%4;
            this.day = 0;
        }
    }
}