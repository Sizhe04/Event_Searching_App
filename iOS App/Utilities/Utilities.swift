//
//  Utilities.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//

import SwiftUI
import Foundation
import Alamofire
import SwiftyJSON

//reference from chatGPT
extension Array: RawRepresentable where Element: Codable {
    public init?(rawValue: String) {
        guard let data = rawValue.data(using: .utf8),
              let result = try? JSONDecoder().decode([Element].self, from: data)
        else {
            return nil
        }
        self = result
    }
    
    public var rawValue: String {
        guard let data = try? JSONEncoder().encode(self),
              let result = String(data: data, encoding: .utf8)
        else {
            return "[]"
        }
        return result
    }
}

extension View {
    func hideKeyboard() {
        let resign = #selector(UIResponder.resignFirstResponder)
        UIApplication.shared.sendAction(resign, to: nil, from: nil, for: nil)
    }
}

extension View {
    
    func toast(isShowing: Binding<Bool>, text: Text, alignment: Alignment) -> some View {
        Toast(isShowing: isShowing,
              presenting: { self },
              text: text, alignment: alignment)
    }
    
}


//extension View {
//    func hiddenNavigationBarStyle() -> some View {
//        modifier( HiddenNavigationBar() )
//    }
//}


struct Toast<Presenting>: View where Presenting: View {
    
    /// The binding that decides the appropriate drawing in the body.
    @Binding var isShowing: Bool
    /// The view that will be "presenting" this toast
    let presenting: () -> Presenting
    /// The text to show
    let text: Text
    
    let alignment: Alignment
    
    var body: some View {
        
        if self.isShowing {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                withAnimation {
                    self.isShowing = false
                }
            }
        }
        
        return GeometryReader { geometry in
            
            ZStack(alignment: alignment) {
                
                self.presenting()
                
                HStack(alignment: .bottom) {
                    self.text
                }
                .frame(width: geometry.size.width * 0.7,
                       height: geometry.size.height / 8)
                .background(Color.secondary.colorInvert())
                .foregroundColor(Color.primary)
                .cornerRadius(20)
                .transition(.slide)
                .opacity(self.isShowing ? 1 : 0)
                
            }
            
        }
        
    }
}

//struct HiddenNavigationBar: ViewModifier {
//    func body(content: Content) -> some View {
//        content
//            .navigationBarTitle("", displayMode: .inline)
//            .navigationBarHidden(true)
//    }
//}

//reference ends.

class APIGet {
    
    let geohash = Geohash()
    
    enum URL: String {
        case IPInfoAPI = "https://ipinfo.io/?token=3317efadd4e11f"
        case preGeocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC2djqPyaFZTIE2jdeoR0It0bQJ_YiZ6bs"
        case ticketMasterSuggestAPI = "https://wsizhe-hw8-2.wl.r.appspot.com/api/ticketMasterSuggest/"
        case eventSearchAPI = "https://wsizhe-hw8-2.wl.r.appspot.com/api/eventSearch/"
        case eventDetailsAPI = "https://wsizhe-hw8-2.wl.r.appspot.com/api/eventDetails/"
        case spotifyAPI = "https://wsizhe-hw8-2.wl.r.appspot.com/spotify/search/"
        case albumAPI = "https://wsizhe-hw8-2.wl.r.appspot.com/spotify/album/";
        
        case ticketMatsterApiKey = "qNHGBwrCsREw50tqWDbzj99LyRfEJlc3"
    }
    
    func geo_IPLocation(completion: @escaping (String) -> Void) {
        let request = AF.request((URL.IPInfoAPI.rawValue).replacingOccurrences(of: " ", with: "+"))
        var res: [String] = []
        request.responseJSON { (response) in
            switch response.result {
                
            case .success(let value):
                let json = JSON(value)
                //                print("JSON: " + "\(json["loc"])")
                let loc = "\(json["loc"])"
                //                json["loc"]
                res = loc.components(separatedBy: ",")
                //                print(res)
                
                let hash = Geohash.encode(latitude: Double(res[0])!, longitude: Double(res[1])!, precision: 5)
                print("GeoHash: " + hash)
                completion(hash)
                
            case .failure(let error): print(error)
            }
        }
    }
    
    func geoCoding(location: String, completion: @escaping (String) -> Void) {
        var res: String
        let request = AF.request((URL.preGeocodingAPI.rawValue + "&address=" + location).replacingOccurrences(of: " ", with: "+"))
        
        request.responseJSON { (response) in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                print("JSON: " + "\(json["results"][0]["geometry"]["location"])")
                let lat = "\(json["results"][0]["geometry"]["location"]["lat"])"
                let lng = "\(json["results"][0]["geometry"]["location"]["lng"])"
                let res = Geohash.encode(latitude: Double(lat)!, longitude: Double(lng)!, precision: 5)
                completion(res)
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func submitHandler(keyword: String,
                       radius: String,
                       segmentId: String,
                       geoPoint: String, completion: @escaping ([EventSearch]) -> Void) {
        
        var eventSearch = [EventSearch]()
        
        let queryString: String
        var request: DataRequest
        
        if segmentId != "" {
            request = AF.request((URL.eventSearchAPI.rawValue + "?keyword=" + keyword
                                  + "&radius=" + radius
                                  + "&segmentId=" + segmentId
                                  + "&geoPoint=" + geoPoint
                                  + "&apikey=" + URL.ticketMatsterApiKey.rawValue
                                  + "&unit=miles").replacingOccurrences(of: " ", with: "+"))
        } else {
            request = AF.request((URL.eventSearchAPI.rawValue + "?keyword=" + keyword
                                  + "&radius=" + radius
                                  + "&geoPoint=" + geoPoint
                                  + "&apikey=" + URL.ticketMatsterApiKey.rawValue
                                  + "&unit=miles").replacingOccurrences(of: " ", with: "+"))
        }
        
        request.responseJSON { (response) in
            switch response.result {
            case .success(let value):
                var json = JSON(value)
                
                //not UNDEFINED:
                if json["_embedded"] != JSON(parseJSON: "null")
                    && json["_embedded"]["events"] != JSON(parseJSON: "null"){
                    json = json["_embedded"]["events"]
                    
                    for (key, item) in json {
                        
                        //                        print("Key IS" + key)
                        //                        print("Item IS:  \(item)")
                        
                        var searchResult = EventSearch()
                        
                        if item["dates"] != JSON(parseJSON: "null"){
                            let date = item["dates"]["start"]["localDate"].stringValue
                            let time = String(item["dates"]["start"]["localTime"].stringValue.prefix(5))
                            if date != "" && time != "" {
                                searchResult.date = date + "|" + time
                            } else{
                                if date != "" {
                                    searchResult.date = date
                                } else {
                                    searchResult.date = time
                                }
                            }
                        }
                        
                        
                        if item["name"] != JSON(parseJSON: "null") {
                            searchResult.name = item["name"].stringValue
                        }
                        if item["id"] != JSON(parseJSON: "null") {
                            searchResult.id = item["id"].stringValue
                        }
                        if item["images"] != JSON(parseJSON: "null") &&
                            item["images"][0] != JSON(parseJSON: "null") &&
                            item["images"][0]["url"] != JSON(parseJSON: "null") {
                            searchResult.imageUrl = item["images"][0]["url"].stringValue
                        }
                        if item["_embedded"] != JSON(parseJSON: "null")
                        {
                            searchResult.venue = item["_embedded"]["venues"][0]["name"].stringValue
                        }
                        
                        eventSearch.append(searchResult)
                        
                    }
                }
                //
                completion(eventSearch)
                
                
            case .failure(let error): print(error)
            }
            
        }
        
    }
    
    func getEventDetails(id: String, completion: @escaping (EventDetails) -> Void) {
        var eventDetails = EventDetails()
        let request = AF.request(URL.eventDetailsAPI.rawValue + "?id=" + id)
        request.responseJSON{ (response) in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                
                let name = json["name"].stringValue
                let id = json["id"].stringValue
                let date = json["dates"]["start"]["localDate"].stringValue
                
                var artist = ""
                var musicArtist: [String] = []
                let attractionsData = json["_embedded"]["attractions"]
                //                print(attractionsData.count)
                //                print(json["_embedded"]["attractions"][0]["name"])
                //                print(attractionsData[0]["classifications"][0]["segment"]["name"].stringValue == "Music")
                print("Attraction COunt:")
                print(attractionsData.count)
                if (attractionsData.count >= 1) {
                    var n = attractionsData.count
                    var i = 0
                    while (n > 1) {
                        artist += attractionsData[i]["name"].stringValue
                        
                        if attractionsData[i]["classifications"][0]["segment"]["name"].stringValue == "Music" {
                            musicArtist.append(attractionsData[i]["name"].stringValue)
                        }
                        n -= 1
                        i += 1
                    }
                    artist += json["_embedded"]["attractions"][i]["name"].stringValue
                    print("Name HERE:")
                    print(json["_embedded"]["attractions"][i]["name"].stringValue)
                    if attractionsData[i]["classifications"][0]["segment"]["name"].stringValue == "Music" {
                        musicArtist.append(attractionsData[i]["classifications"][0]["segment"]["name"].stringValue)
                    }
                }
                
                let venue = json["_embedded"]["venues"][0]["name"].stringValue
                
                var genre: String
                var a = json["classifications"][0]["genre"]["name"].stringValue + " | "
                var b = json["classifications"][0]["segment"]["name"].stringValue + " | "
                var c = json["classifications"][0]["subGenre"]["name"].stringValue
                if a == " | " && b == " | " && c == " | " {
                    genre = ""
                } else{
                    genre = a + b + c
                }
                
                var priceRange = ""
                if json["priceRanges"] != JSON(parseJSON: "null") {
                    let min = json["priceRanges"][0]["min"].stringValue
                    let max = json["priceRanges"][0]["max"].stringValue
                    if min != "" && max != "" {
                        priceRange = min + "-" + max
                    } else {
                        if min == "" {
                            priceRange = max
                        } else {
                            priceRange = min
                        }
                    }
                }
                
                var ticketStatus = ""
                let sellingStatus = json["dates"]["status"]["code"].stringValue
                print(sellingStatus)
                print(type(of: sellingStatus))
                if (sellingStatus == "onsale") {
                    ticketStatus = "On Sale";
                } else if (sellingStatus == "offsale") {
                    ticketStatus = "Off Sale";
                } else if (sellingStatus == "cancelled") {
                    ticketStatus = "Cancelled";
                } else if (sellingStatus == "postponed") {
                    ticketStatus = "Postponed";
                } else {
                    ticketStatus = "Rescheduled";
                }
                
                
                let buyTicketAt = json["url"].stringValue
                let shareLink = json["url"].stringValue
                
                let seatPhotoLink = json["seatmap"]["staticUrl"].stringValue
                
                let iconImage = json["images"][0]["url"].stringValue
                
                eventDetails = EventDetails(id: id,
                                            name: name,
                                            date: date,
                                            artist: artist,
                                            venue: venue,
                                            genre: genre,
                                            priceRange: priceRange,
                                            ticketStatus: ticketStatus,
                                            buyTicketAt: buyTicketAt,
                                            shareLink: shareLink,
                                            seatPhotoLink: seatPhotoLink,
                                            iconImage: iconImage,
                                            MusicList: musicArtist)
                
//                print(eventDetails)
                completion(eventDetails)
                
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func getVenueDetails(id: String, completion: @escaping (VenueDetails) -> Void) {
        var venueDetails = VenueDetails()
        let request = AF.request(URL.eventDetailsAPI.rawValue + "?id=" + id)
        request.responseJSON{ (response) in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                
                let id = json["_embedded"]["venues"][0]["id"].stringValue
                
                let titlaName = json["name"].stringValue
                
                let name = json["_embedded"]["venues"][0]["name"].stringValue
                let address = json["_embedded"]["venues"][0]["address"]["line1"].stringValue
                let phoneNumber = json["_embedded"]["venues"][0]["boxOfficeInfo"]["phoneNumberDetail"].stringValue
                let openHours = json["_embedded"]["venues"][0]["boxOfficeInfo"]["openHoursDetail"].stringValue
                let generalRule = json["_embedded"]["venues"][0]["generalInfo"]["generalRule"].stringValue
                let childRule = json["_embedded"]["venues"][0]["generalInfo"]["childRule"].stringValue
                let latitude = json["_embedded"]["venues"][0]["location"]["latitude"].stringValue
                let longitude = json["_embedded"]["venues"][0]["location"]["longitude"].stringValue
                
                venueDetails = VenueDetails(id: id, titleName: titlaName, name: name, address: address, phoneNumber: phoneNumber, openHours: openHours, generalRule: generalRule, childRule: childRule, latitude: latitude, longitude: longitude)
                
//                print(venueDetails)
                completion(venueDetails)
                
                
            case .failure(let error): print(error)
            }
            
        }
    }
    
    func ticketMasterSuggest(text: String, completion: @escaping ([String]) -> Void) {
        var suggest = [String]()
//        let request = AF.request((URL.ticketMasterSuggestAPI.rawValue + "?keyword=" + text + "&apikey=" + URL.ticketMatsterApiKey.rawValue).replacingOccurrences(of: " ", with: "+"))
        let request = AF.request(URL.ticketMasterSuggestAPI.rawValue + "?keyword=" + text)
        request.responseJSON {(response) in
            print("Suggest:")
            //            print(response)
            
            switch response.result {
                
            case .success(let value):
                let json = JSON(value)
                
                for (_, res) in json["_embedded"]["attractions"] {
                    suggest.append(res["name"].stringValue)
                }
                
                print(suggest)
                completion(suggest)
                
            case .failure(let error): print(error)
            }
        }
    }
    
    func getSpotifyInfo(name: String, completion: @escaping (SpotifyInfo) -> Void) {
        let formatNumber = formatNumber()
        
        var spotifyInfo = SpotifyInfo()
        let request = AF.request((URL.spotifyAPI.rawValue + name).replacingOccurrences(of: " ", with: "+"))
        request.responseJSON {(response) in
            
            switch response.result {
                
            case .success(let value):
                let json = JSON(value)
                
                let id = json["artists"]["items"][0]["id"].stringValue
                let artistName = json["artists"]["items"][0]["name"].stringValue
                
                var followers = json["artists"]["items"][0]["followers"]["total"].stringValue
                followers = formatNumber.formatNumberWithSuffix(Int(followers)!)
                
                let popularity = json["artists"]["items"][0]["popularity"].stringValue
                let photoLink = json["artists"]["items"][0]["images"][0]["url"].stringValue
                let spotifyLink = json["artists"]["items"][0]["external_urls"]["spotify"].stringValue
                
//                DispatchQueue.main.async {
//                    self.getAlbumInfo(id: id) { res in
//                        print("HERE 1")
//                        albumInfo = res
//                        print(albumInfo)
//
//                    }
//                }
                spotifyInfo = SpotifyInfo(id: id, artistName: artistName, popularity: popularity, followers: followers, photoLink: photoLink, spotifyLink: spotifyLink)
                 
                completion(spotifyInfo)
                    
            case .failure(let error): print(error)
            }
        }
    }
    
    func getAlbumInfo(id: String, completion: @escaping (AlbumInfo) -> Void){
        var albumInfo = AlbumInfo()
        let request = AF.request((URL.albumAPI.rawValue + id).replacingOccurrences(of: " ", with: "+"))
        request.responseJSON {(response) in
            switch response.result {
            case .success(let value):
                let json = JSON(value)
                
                
                let albumImage0 = json["items"][0]["images"][0]["url"].stringValue
                let albumImage1 = json["items"][1]["images"][0]["url"].stringValue
                let albumImage2 = json["items"][2]["images"][0]["url"].stringValue

                albumInfo = AlbumInfo(albumImage0: albumImage0, albumImage1: albumImage1, albumImage2: albumImage2)
                
                completion(albumInfo)
                
            case .failure(let error): print(error)
            }
        }
    }
    
    
    
    
    
    
    
}


