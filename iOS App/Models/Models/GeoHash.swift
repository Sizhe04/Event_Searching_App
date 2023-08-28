//
//  GeoHash.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//


//This file is about GeoHash, not written by me.
//All reference --- Geohash
import Foundation

struct Geohash {
    private static let base32 = "0123456789bcdefghjkmnpqrstuvwxyz"

    static func encode(latitude: Double, longitude: Double, precision: Int = 12) -> String {
        var hash = ""
        var minLat = -90.0
        var maxLat = 90.0
        var minLon = -180.0
        var maxLon = 180.0
        var isEven = true

        var bit = 0
        var ch = 0

        while hash.count < precision {
            if isEven {
                let mid = (minLon + maxLon) / 2
                if longitude >= mid {
                    ch |= 1 << (4 - bit)
                    minLon = mid
                } else {
                    maxLon = mid
                }
            } else {
                let mid = (minLat + maxLat) / 2
                if latitude >= mid {
                    ch |= 1 << (4 - bit)
                    minLat = mid
                } else {
                    maxLat = mid
                }
            }

            isEven.toggle()
            if bit < 4 {
                bit += 1
            } else {
                let index = base32.index(base32.startIndex, offsetBy: ch)
                hash.append(base32[index])
                bit = 0
                ch = 0
            }
        }

        return hash
    }
}
