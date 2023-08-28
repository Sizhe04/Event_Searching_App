//
//  EventDetails.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//

import Foundation

struct EventDetails: Codable, Identifiable {
    var id: String?
    var name: String?
    var date: String?
    var artist: String?
    var venue: String?
    var genre: String?
    var priceRange: String?
    var ticketStatus: String?
    var buyTicketAt: String?
    var shareLink: String?
    var seatPhotoLink: String?
    var loaded = false
    
    var iconImage: String?
    
    var MusicList: [String] = []
}
