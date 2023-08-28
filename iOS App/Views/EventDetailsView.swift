//
//  EventDetailsView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/12.
//

import SwiftUI




struct EventDetailsView: View {
    
    @EnvironmentObject var searchViewModel: SearchViewModel
    
    
    @State private var showRemind = false
    @State private var showRemoveRemind = false
    
    

    @State private var reserved = false
    
    
    
    func titleName() -> String {
        if let safeTitleName = searchViewModel.eventDetails.name {
            return safeTitleName
        } else {
            return ""
        }
    }
    
    func date() -> String {
        if let safeDate = searchViewModel.eventDetails.date {
            return safeDate
        } else {
            return ""
        }
    }
    
    func artist() -> String {
        if let safeArtist = searchViewModel.eventDetails.artist {
            return safeArtist
        } else {
            return ""
        }
    }
    
    func venue() -> String {
        if let safeVenue = searchViewModel.eventDetails.venue {
            return safeVenue
        } else {
            return ""
        }
    }
    
    func genre() -> String {
        if let safeGenre = searchViewModel.eventDetails.genre {
            return safeGenre
        } else {
            return ""
        }
    }
    
    func priceRange() -> String {
        if let safePriceRange = searchViewModel.eventDetails.priceRange {
            return safePriceRange
        } else {
            return ""
        }
    }
    
    func ticketStatus() -> String {
        if let SafeTicketStatus = searchViewModel.eventDetails.ticketStatus {
            return SafeTicketStatus
        } else {
            return ""
        }
    }
    
    func buyTicketUrl() -> String {
        if let safeBuyTicket = searchViewModel.eventDetails.buyTicketAt {
            return safeBuyTicket
        } else {
            return ""
        }
    }
    
    func ImageUrl() -> String {
        if let safeImageUrl = searchViewModel.eventDetails.seatPhotoLink {
            return safeImageUrl
        } else {
            return ""
        }
    }
    
    func shareLink() -> String {
        if let safeShareLink = searchViewModel.eventDetails.shareLink {
            return safeShareLink
        } else {
            return ""
        }
    }
    
    func loaded() -> Bool {
        return searchViewModel.eventDetails.loaded
    }
    
    func checkFavoriteStatus() {
            searchViewModel.isEventFavorite = searchViewModel.favorites.contains(where: { $0.id == searchViewModel.eventDetails.id })
    }
    
    var body: some View {
        
        VStack(alignment: .center) {
            if loaded() {
                //加到这里
                bigTitle
                    .padding(.bottom, -10)
                content
                    .padding(.bottom, -10)
                addFavoritesButton
                    .padding(.bottom, -10)
                
                if ImageUrl() != "" {
                    seatImage
                        .padding(.bottom, -10)
                } else {
                    seatImage_empty
                        .padding(.bottom, -10)
                }
                
                buyTicketAndShare
                Spacer()
                
            } else {
                VStack(alignment: .center) {
                    Spacer()
                    HStack {
                        Spacer()
                        VStack{
                            ProgressView()
                            Text("Please wait")
                                .foregroundColor(.gray)
                        }
                        
                        Spacer()
                    }
                    Spacer()
                }
            }
      

            
        }
        .toast(isShowing: $showRemind, text: Text("Added to favorites"), alignment: Alignment.bottom)
        .toast(isShowing: $showRemoveRemind, text: Text("Removed from favorites"), alignment: Alignment.bottom)
        .onAppear(perform: checkFavoriteStatus)
    }
    
    
    var bigTitle: some View {
        Text(titleName())
            .font(.title)
            .fontWeight(.bold)
            .lineLimit(1)
            .truncationMode(.tail)
            .padding(.top, -20)
    }
    
    var content: some View {
        VStack {
            HStack(alignment: .top) {
                VStack(alignment: .leading) {
                    Text("Date")
                        .fontWeight(.bold)
                    Text(date())
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.leading)
                }
                .frame(width: 100) 
                Spacer()
                
                VStack(alignment: .trailing) {
                    Text("Artist | Team")
                        .fontWeight(.bold)
                    Text(artist())
                        .frame(maxWidth: .infinity, alignment: .trailing)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.trailing)
                }
            }
            .padding(.all)
            
            HStack(alignment: .top) {
                VStack(alignment: .leading) {
                    Text("Venue")
                        .fontWeight(.bold)
                    Text(venue())
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.leading)
                }
                Spacer()
                
                VStack(alignment: .trailing) {
                    Text("Genre")
                        .fontWeight(.bold)
                    Text(genre())
                        .frame(maxWidth: .infinity, alignment: .trailing)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.trailing)
                }
            }
            .padding([.leading, .bottom, .trailing])
            
            
            HStack(alignment: .top) {
                VStack(alignment: .leading) {
                    Text("Price Range")
                        .fontWeight(.bold)
                    Text(priceRange())
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.leading)
                }
                Spacer()
                
                VStack(alignment: .trailing) {
                    
                    Text("Ticket Status")
                        .fontWeight(.bold)
                    
                    Text(ticketStatus())
                    //                        .frame(maxWidth: .infinity, alignment: .center)
                        .foregroundColor(.white)
                        .multilineTextAlignment(.trailing)
                        .padding(.horizontal, 15)
                        .padding(.vertical,5)
                        .background(
                            ticketStatus() == "On Sale"
                            ? Color.green
                            : ticketStatus() == "Off Sale"
                            ? Color.red
                            : ticketStatus() == "Canceled"
                            ? Color.black
                            : ticketStatus() == "Postponed" ||
                            ticketStatus() == "Rescheduled"
                            ? Color.orange : Color.yellow)
                        .cornerRadius(7)
                    
                    
                    
                }
            }
            .padding([.leading, .bottom, .trailing])
        }
    }
    
    var addFavoritesButton: some View {
        //!reserved
        //&& !searchViewModel.favorites.contains(where: {$0.id == searchViewModel.eventDetails.id})
        if !searchViewModel.isEventFavorite   {
            return AnyView(Button(action: {
                searchViewModel.addFavorites()
                reserved = true
                

//reference from chatGPT
                withAnimation {
                    showRemind.toggle()
                }
            }) {
                HStack {
                    Spacer()
                    Text("Save Event")
                        .fontWeight(.bold)
                    Spacer()
                }
            }
                .frame(width: 130 , height: 50, alignment: .center)
                .foregroundColor(.white)
                .background(.blue)
                .cornerRadius(15))
        } else {
            return AnyView(Button(action: {
                searchViewModel.deleteFavorite()
//                reserved = false
                withAnimation {
                    showRemoveRemind.toggle()
                }
//                withAnimation {
//                    showRemind.toggle()
//                }
            }) {
                HStack {
                    Spacer()
                    Text("Remove Favorite")
                        .fontWeight(.bold)
                        .lineLimit(1)
                    Spacer()
                }
            }
                .frame(width: 130 , height: 50, alignment: .center)
                .foregroundColor(.white)
                .background(.red)
                .cornerRadius(15))
        }
 
    }
    
//reference ends
    
    var seatImage: some View {

                VStack {
                    AsyncImage(url: URL(string: ImageUrl())) { image in
                        image.resizable()
                    }
                        placeholder: {
//                        ProgressView()
                    }
                    .frame(width: 230, height: 210)
                }
                .frame(height: 250)
        }
    
    var seatImage_empty: some View {
        VStack {
            Rectangle()
                .fill(Color.clear)
                .frame(width: 230, height: 210)
        }
        .frame(height: 250)
    }

    
    var buyTicketAndShare: some View {
        VStack {
            HStack {
                Text("Buy Ticket At: ")
                    .foregroundColor(.black)
                    .fontWeight(.bold)
                
                Text(.init("[Ticketmaster](\(buyTicketUrl()))"))
                    .foregroundColor(.blue)
            }
            
            HStack {
                Text("Share on: ")
                    .fontWeight(.bold)
                
                Link(destination: URL(string: "https://www.facebook.com/sharer/sharer.php?u=\(shareLink())")!, label: {
                    Image("facebook")
                        .resizable()
                        .frame(width: 40, height: 40)
                })
                
                Link(destination: URL(string: "https://twitter.com/intent/tweet?url=\(shareLink())")!, label: {
                    Image("twitter")
                        .resizable()
                        .frame(width: 40, height: 40)
                })
//                Link(destination: URL(string: "https://twitter.com/intent/tweet?text=Check%20\(titleName())%20on%20Ticketmaster.%0A&url=" + shareLink())!, label: {
//                    Image("twitter")
//                        .resizable()
//                        .frame(width: 40, height: 40)
//                })

            }
        }
    }
    
    
    
}

struct EventDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        EventDetailsView()
            .environmentObject(SearchViewModel())
    }
}
