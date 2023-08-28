//
//  SearchFormModel.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//

import Foundation
import SwiftUI

class SearchViewModel: ObservableObject {
    @Published var events = [EventSearch]()
    @Published var eventDetails = EventDetails()
    @Published var venueDetails = VenueDetails()
    @Published var spotifyInfo = [SpotifyInfo]()
    @Published var loading = false
    @Published var loaded = false
    @Published var autoComplete = [String]()
    
    @Published var isEventFavorite: Bool = false
//    @Published var numOfMusic: Int
    
    @AppStorage("FavoriteList") var favorites = [FavoritesList]()
    
    let apiGet = APIGet()
    
    func getAutoComplete(text: String) {
        apiGet.ticketMasterSuggest(text: text) { res in
            print(res)
            self.autoComplete = res
            print("Suggestions Are: ")
            print(self.autoComplete)
        }
    }
    
    //reference from chatGPT
    func dateFromString(dateString: String) -> Date? {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let dateComponents = dateString.components(separatedBy: "|")
        return dateFormatter.date(from: dateComponents[0])
    }
    //reference ends
    
    func getEvents(keyword: String, radius:String, category: String, location: String?, autoDetect: Bool) {
        self.loading = true
        
        var segmentId = ""
        if (category == "Music") {
            segmentId = "KZFzniwnSyZfZ7v7nJ";
        } else if (category == "Sports") {
            segmentId = "KZFzniwnSyZfZ7v7nE";
        } else if (category == "Arts & Theatre") {
            segmentId = "KZFzniwnSyZfZ7v7na";
        } else if (category == "Film") {
            segmentId = "KZFzniwnSyZfZ7v7nn";
        } else if (category == "Miscellaneous") {
            segmentId = "KZFzniwnSyZfZ7v7n1";
        } else if (category == "Default") {
            segmentId = "";
        }
        
        if !autoDetect {
//            self.loading = false
//            self.loaded = true
            apiGet.geoCoding(location: location!) { res in
                print("RES:")
                print(res)
                
                
                
//                self.apiGet.submitHandler(keyword: keyword, radius: radius, segmentId: segmentId, geoPoint: res) { eventResults in
//                    self.events = eventResults
//                    print("EVENTS IS:")
//                    print(self.events)
//                }
                
                //reference from chatGPT
                self.apiGet.submitHandler(keyword: keyword, radius: radius, segmentId: segmentId, geoPoint: res) { eventResults in
                    self.events = eventResults.sorted(by: { (event1, event2) -> Bool in
                        guard let date1 = event1.date, let date2 = event2.date else {
                            return false
                        }
                        guard let event1Date = self.dateFromString(dateString: date1), let event2Date = self.dateFromString(dateString: date2) else {
                            return false
                        }
                        return event1Date < event2Date
                    })
                    print(self.events)
                }
                //reference ends
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    self.loading = false
                    self.loaded = true

                }
            }
        } else {
            //autoDetect
            self.loading = true
            apiGet.geo_IPLocation() { res in
                print(res)
//                self.apiGet.submitHandler(keyword: keyword, radius: radius, segmentId: segmentId, geoPoint: res) { eventResults in
//                    self.events = eventResults
//                    print(self.events)
//                }
                
                //reference from chatGPT
                self.apiGet.submitHandler(keyword: keyword, radius: radius, segmentId: segmentId, geoPoint: res) { eventResults in
                    self.events = eventResults.sorted(by: { (event1, event2) -> Bool in
                        guard let date1 = event1.date, let date2 = event2.date else {
                            return false
                        }
                        guard let event1Date = self.dateFromString(dateString: date1), let event2Date = self.dateFromString(dateString: date2) else {
                            return false
                        }
                        return event1Date < event2Date
                    })
                    print(self.events)
                }
                //references ends

                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    self.loading = false
                    self.loaded = true

                }
            }
        }
//        self.loading = false
//        self.loaded = true
    }
        
    
    func getEventDetails(id: String) {
//        self.eventDetails = EventDetails()
//        self.venueDetails = VenueDetails()
//        self.spotifyInfo = [SpotifyInfo]()
        
        apiGet.getEventDetails(id: id) { eventDetails in
            self.eventDetails.loaded = false
            
            self.eventDetails = eventDetails
            
            
            print("EventDetails")
            print(self.eventDetails)
//            for artist in self.eventDetails.MusicList {
//                print("Artist")
//                print(artist)
//                self.getSpotifyInfo(name: artist)
//            }
            self.getSpotifyInfo()
            print("SpotifyINFO")
            print(self.spotifyInfo)
            
            self.eventDetails.loaded = true
        }
                
    }
    
    func getVenueDetails(id: String) {
        apiGet.getVenueDetails(id: id) { venueDetails in
            self.venueDetails = venueDetails
            print("VenueDetails")
//            print(self.venueDetails)
        }
    }
    
    func getSpotifyInfo() {
//        self.numOfMusic = self.eventDetails.MusicList.count
        
        for artist in self.eventDetails.MusicList {
            apiGet.getSpotifyInfo(name: artist) { spotifyInfo in
                var spotifyInfo_t = spotifyInfo
                self.apiGet.getAlbumInfo(id: spotifyInfo.id) { res in
                    
                    spotifyInfo_t.albumImage0 = res.albumImage0!
                    spotifyInfo_t.albumImage1 = res.albumImage1!
                    spotifyInfo_t.albumImage2 = res.albumImage2!
                    self.spotifyInfo.append(spotifyInfo_t)
                  
                    self.spotifyInfo = self.spotifyInfo.sorted { a, b in
                        // 将popularity属性转换为整数，如果转换失败则默认为0
                        let popularityA = Int(a.popularity) ?? 0
                        let popularityB = Int(b.popularity) ?? 0

                        // 返回降序排序的结果
                        return popularityA > popularityB
                    }

                    print(self.spotifyInfo)
                }
            }
        }
        
        
    }
    
    func clear() {
        self.events = [EventSearch]()
        self.eventDetails = EventDetails()
        self.venueDetails = VenueDetails()
        self.spotifyInfo = [SpotifyInfo]()
        self.loaded = false
        self.loading = false
    }
    
    func setLoadedToFalse() {
        self.eventDetails.loaded = false
        print("Loaded is False now")
    }
    
    func addFavorites() {
        DispatchQueue.main.asyncAfter(deadline: .now()) {
            let favorite = FavoritesList(date: self.eventDetails.date, name: self.eventDetails.name, id: self.eventDetails.id, genre: self.eventDetails.genre, venue: self.eventDetails.venue)
            
            self.favorites.append(favorite)
            
            self.isEventFavorite = true
        }
        
        print("FavoritesList:")
        print(favorites)
        print(favorites.count)
     

    }
    
    func deleteFavorite() {
        favorites = favorites.filter { $0.id != self.eventDetails.id }
        
        self.isEventFavorite = false
        print("FavoritesList:")
        print(favorites)
        print(favorites.count)

    }
    
    
}
