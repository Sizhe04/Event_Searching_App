//
//  VenueDetails.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/11.
//

import Foundation

struct VenueDetails: Codable, Identifiable {
    var id: String?
    
    var titleName: String?
    var name: String?
    var address: String?
    var phoneNumber: String?
    var openHours: String?
    var generalRule: String?
    var childRule: String?
    var latitude = ""
    var longitude = ""
}
