//
//  FavoritesView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/11.
//

import SwiftUI

struct FavoritesView: View {
    @EnvironmentObject var searchViewModel: SearchViewModel
    
    
    //reference from chatGPT
    func deleteOneFav(at offsets: IndexSet) {
        searchViewModel.favorites.remove(atOffsets: offsets)
        print(searchViewModel.favorites.count)
    }
    //reference ends
    
    
    var body: some View {
        
        if searchViewModel.favorites.count == 0 {
            Text("No favorites found")
                .foregroundColor(.red)
        } else {
            List {
                ForEach(searchViewModel.favorites) { fav in
                    Favorite(date: fav.date!, name: fav.name!,  genre: fav.genre!, venue: fav.venue!)
                }
                .onDelete(perform: deleteOneFav)
            }
        }
    }
    
    
    struct  Favorite: View {
        let date: String
        let name: String
        let genre: String
        let venue: String
        
        var body: some View {
            HStack {
                Text(date)
                    .multilineTextAlignment(.leading)
                    .frame(width: 80.0)

                Text(name)
                    .multilineTextAlignment(.leading)
                    .frame(width: 75.0)
                    .lineLimit(2)
                        .truncationMode(.tail)
                Text(genre)
                    .multilineTextAlignment(.leading)
                    .frame(width: 90.0)
                Text(venue)
                    .multilineTextAlignment(.trailing)
                    .frame(width: 50.0)
            }.font(.footnote)
            }
        }
    
}

struct FavoritesView_Previews: PreviewProvider {
    static var previews: some View {
        FavoritesView()
            .environmentObject(SearchViewModel())
    }
}
