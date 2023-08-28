//
//  formatNumber.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/11.
//

import Foundation

class formatNumber {
    func formatNumberWithSuffix(_ number: Int) -> String {
        let thousand = 1000
        let million = 1000000
        
        if number >= million {
            let millionValue = Double(number) / Double(million)
            return "\(Int(round(millionValue)))M"
        } else if number >= thousand {
            let thousandValue = Double(number) / Double(thousand)
            return "\(Int(round(thousandValue)))K"
        } else {
            return "\(number)"
        }
    }
}
