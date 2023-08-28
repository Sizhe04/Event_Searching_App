//
//  EventSearch.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//

import Foundation
import UIKit

struct EventSearch: Decodable {
    
//    let _embedded: [events]
    var date: String?
    var name: String?
    var id: String?
    var imageUrl: String?
    var venue: String?
    
}

//struct events: Decodable, Identifiable {
//
//
//    let name: String?
//    let id: String?
//    let dates: [start]
//    let images: [image]
//    let _embedded: [venues]
//}
//
//struct start: Decodable {
//    let localDate: String?
//    let localTime: String?
//}
//
//struct image: Decodable {
//    let url: String?
//}
//
//struct venues: Decodable {
//
//}
