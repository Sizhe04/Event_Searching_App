//
//  FavoritesList.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//

import Foundation

struct FavoritesList: Codable, Identifiable, Equatable {
    
//    let _embedded: [events]
    var date: String?
    var name: String?
    var id: String?
    var genre: String?
    var venue: String?
    
}

