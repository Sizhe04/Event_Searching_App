//
//  GoogleMapView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/12.
//

import SwiftUI
import MapKit
import CoreLocation


//reference from stackView

struct Marker: Identifiable {
    let id: UUID
    let location: CLLocationCoordinate2D
    init(id: UUID = UUID(), lat: Double, long: Double) {
        self.id = id
        self.location = CLLocationCoordinate2D(
            latitude: lat,
            longitude: long)
    }
}





struct GoogleMapView: View {
    let place: Marker
    @State var region: MKCoordinateRegion
    @Binding var googleMap: Bool
    
    var body: some View {
        VStack {
            Map(coordinateRegion: $region,
                annotationItems: [place])
            { place in
                MapMarker(coordinate: place.location,
                       tint: Color.red)
            }
        }.onTapGesture {
            googleMap = false
        }
    }
    
}

struct GoogleMapView_Previews: PreviewProvider {
    @State static private var latitude: String = "34.0522"
    @State static private var longitude: String = "-118.2437"
    @State static private var googleMap: Bool = true
    
    static var previews: some View {
        GoogleMapView(place: Marker(id: UUID(), lat: 40.7280299, long: -74.00167), region: MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: 40.7280299, longitude: -74.00167), span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)),googleMap: $googleMap)
    }
}
