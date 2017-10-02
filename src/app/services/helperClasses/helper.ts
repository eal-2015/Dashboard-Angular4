
export class Helper{

    /**
     * Copy Objects
     * @param source Source, Copy from this object
     * @param dest Destination, Copy to this object (this object is going to be modify)
     */
    public static copy(source: object, dest: object): void{
        if(source && dest){
            for (var key in dest) {
                if (dest.hasOwnProperty(key) && source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }

    /**
     * Get Website's absolute Link
     * @param uri Add URI to the link
     * @param query Add Query String to the link
     */
    public static link(uri?: string, query?: object): string{
        var url = window.location.protocol + "//" + window.location.host;
        if(uri){
            url += uri;
        }
        if(query){
            let param = null;
            for (var i in query) {
                if (query.hasOwnProperty(i)) {
                    var element = query[i];
                    if(param !== null){
                        param = "?" + i + "=" + encodeURIComponent(element);
                    }
                    else{
                        param += "&" + i + "=" + encodeURIComponent(element);
                    }
                }
            }
            if(param){
                url += param;
            }
        }
        return url;
    }
}