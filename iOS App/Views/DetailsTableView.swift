//
//  DetailsTableView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/11.
//

import SwiftUI
import CoreLocation
import MapKit

struct DetailsTableView: View {
    
    @EnvironmentObject var searchViewModel: SearchViewModel
    @State var id: String
    @State private var tab = "First"
    
    var body: some View {
        TabView(selection: $tab) {
            EventDetailsView()
                .tabItem {
                    Label("Events", systemImage: "text.bubble.fill")
                }
                .tag("First")
            
            ArtistsView()
                .tabItem {
                    Label("Artist/Team", systemImage: "guitars.fill")
                }
                .tag("Second")
            
            VenueDetailsView()
                .tabItem {
                    Label("Venue", systemImage: "location.fill")
                }
                .tag("Third")
        }
        .onAppear {
            searchViewModel.getEventDetails(id: id)
            print(searchViewModel.eventDetails.MusicList)
            
//            for eachArtist in searchViewModel.eventDetails.MusicList {
//                print("ARTIST IS: \(eachArtist)")
//                searchViewModel.getSpotifyInfo(name: eachArtist)
//            }
            
            searchViewModel.getVenueDetails(id: id)
           

                
            
            
        }
        .onDisappear {
            searchViewModel.setLoadedToFalse()
        }
    }
}

struct DetailsTableView_Previews: PreviewProvider {
    static var previews: some View {
        DetailsTableView(id:"G5vYZ9KDbiIMY")
            .environmentObject(SearchViewModel())
    }
}
