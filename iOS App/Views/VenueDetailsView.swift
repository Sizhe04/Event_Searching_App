//
//  VenueDetailsView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/12.
//

import SwiftUI
import MapKit
import CoreLocation


struct VenueDetailsView: View {
    
    @EnvironmentObject var searchViewModel: SearchViewModel
    @Environment(\.presentationMode) var presentationMode
    
    @State private var googleMap = false
    //    @State private var latitude: String
    //    @State private var longitude: String
    
    func bigTitle() -> String {
        if let safeTitle = searchViewModel.venueDetails.titleName {
            return safeTitle
        } else {
            return ""
        }
    }
    
    func name() -> String {
        if let safeName = searchViewModel.venueDetails.name {
            return safeName
        } else {
            return ""
        }
    }
    
    func Address() -> String {
        if let safeAddress = searchViewModel.venueDetails.address {
            return safeAddress
        } else {
            return ""
        }
    }
    
    func phoneNumber() -> String {
        if let safePhone = searchViewModel.venueDetails.phoneNumber {
            return safePhone
        } else {
            return ""
        }
    }
    
    func openHours() -> String {
        if let safeOpenHours = searchViewModel.venueDetails.openHours  {
            return safeOpenHours
        } else {
            return ""
        }
    }
    
    func generalRule() -> String {
        if let safeGeneralRule = searchViewModel.venueDetails.generalRule {
            return safeGeneralRule
        } else {
            return ""
        }
    }
    
    func childRule() -> String {
        if let safeChildRule = searchViewModel.venueDetails.childRule {
            return safeChildRule
        } else {
            return ""
        }
    }
    
    func getLatitude() -> String {
        //        if let safeLatitude = searchViewModel.venueDetails.latitude {
        //            return safeLatitude
        //        } else {
        //            return ""
        //        }
        return searchViewModel.venueDetails.latitude
    }
    
    func getLongitude() -> String {
        //        if let safeLongitude = searchViewModel.venueDetails.longitude {
        //            return safeLongitude
        //        } else {
        //            return ""
        //        }
        return searchViewModel.venueDetails.longitude
    }
    
    
    
    
    var body: some View {
        
        VStack(alignment: .center) {
            //Spacer()
            titleName
            Spacer()
            content
            showGoogleMapButton
                .sheet(isPresented: $googleMap) {
                        // Map view
                        GoogleMapView(place: Marker(id: UUID(), lat: Double(searchViewModel.venueDetails.latitude) ?? 0, long: Double(searchViewModel.venueDetails.longitude) ?? 0), region: MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: Double(searchViewModel.venueDetails.latitude) ?? 0, longitude: Double(searchViewModel.venueDetails.longitude) ?? 0), span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)), googleMap: $googleMap)
                }
            Spacer()
        }
        
    }
    
    
    
    
    
    
    var titleName: some View  {
        Text(bigTitle())
            .font(.title2)
            .fontWeight(.bold)
        
        
    }
    
    var content: some View {
        VStack {
            VStack(alignment: .center) {
                Text("Name")
                    .fontWeight(.bold)
                Text(name())
                    .frame(maxWidth: .infinity, alignment: .center)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            .padding([.leading, .bottom, .trailing])
            
            
            VStack(alignment: .center) {
                Text("Address")
                    .fontWeight(.bold)
                Text(Address())
                    .frame(maxWidth: .infinity, alignment: .center)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }
            .padding([.leading, .bottom, .trailing])
            
            
            if phoneNumber() != "" {
                VStack(alignment: .center) {
                    Text("Phone Number")
                        .fontWeight(.bold)
                    Text(phoneNumber())
                        .frame(maxWidth: .infinity, alignment: .center)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
                .padding([.leading, .bottom, .trailing])
            }
           
            
            if openHours() != "" {
                VStack(alignment: .center) {
                    Text("Open Hours")
                        .fontWeight(.bold)
                    Text(openHours())
                        .frame(maxWidth: .infinity, alignment: .center)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
                .padding([.leading, .bottom, .trailing])
            }
            
            
            
            if generalRule() != "" {
                VStack(alignment: .center) {
                    Text("General Rule")
                        .fontWeight(.bold)
                    ScrollView {
                        Text(generalRule())
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                    }
                    .frame(width: 350, height: 60) // 根据需要设置宽度和高度
                    .background(Color(.systemBackground))
                }
                .padding([.leading, .bottom, .trailing])
            }
            
            if childRule() != "" {
                VStack(alignment: .center) {
                    Text("Child Rule")
                        .fontWeight(.bold)
                    ScrollView {
                        Text(childRule())
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                    }
                    .frame(width: 350, height: 60) // 根据需要设置宽度和高度
                    .background(Color(.systemBackground))
                }
                .padding([.leading, .bottom, .trailing])
            }
            
        }
    }
    
    
    var showGoogleMapButton: some View {
        Button(action: {
            googleMap.toggle()
            
        }) {
            HStack {
                Spacer()
                Text("Show venue on maps")
                Spacer()
            }
        }
        .frame(width: 200 , height: 50, alignment: .center)
        .foregroundColor(.white)
        .background(.red)
        .cornerRadius(15)
        .padding(.bottom)
        
    }
    
    
    
    
    
    
    
    
}

struct VenueDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        VenueDetailsView()
            .environmentObject(SearchViewModel())
    }
}
