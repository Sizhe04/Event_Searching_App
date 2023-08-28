//
//  ArtistsView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/12.
//

import SwiftUI

struct ArtistsView: View {
    @ EnvironmentObject var searchViewModel: SearchViewModel
    

    var body: some View {
     

        if searchViewModel.eventDetails.MusicList.count == 0 {
            NoArtist()
        } else {
            VStack{
                ScrollView{
                    ForEach(0..<searchViewModel.spotifyInfo.count) { i in
                        let artist = searchViewModel.spotifyInfo[i]
                        Artist(artistName: artist.artistName,
                               popularity: artist.popularity,
                               followers: artist.followers,
                               photoLink: artist.photoLink,
                               spotifyLink: artist.spotifyLink,
                               albumImage0: artist.albumImage0,
                               albumImage1: artist.albumImage1,
                               albumImage2: artist.albumImage2)
                    }
                }
                .frame(width: 400, height: 600)
                    
                
            }
        }
        
    }
    
    struct NoArtist: View {
        var body: some View {
            VStack(alignment: .center) {
                Spacer()
                HStack {
                    Spacer()
                    Text("No music related artist details to show")
                        .fontWeight(.bold)
                        .font(.title)
                        .padding()
                        .multilineTextAlignment(.center)
                    Spacer()
                }
                Spacer()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
    
    
    
    
    struct Artist: View {
        var artistName: String
        var popularity: String
        var followers: String
        var photoLink: String
        var spotifyLink: String
        var albumImage0: String
        var albumImage1: String
        var albumImage2: String
        
        var body: some View {
            VStack {
                //            Rectangle()
                //                .foregroundColor(Color.black.opacity(0.8)) // Set background color to a light black
                //                .frame(width: 360, height: 300) // Set fixed size for the rectangle
                //                .cornerRadius(10)
                //                .padding()
                VStack {
                    HStack(alignment: .top){
                        //第一行三列
                        //第一个
                        VStack{
                            AsyncImage(url: URL(string: photoLink)) { image in
                                image.resizable()
                            } placeholder: {
                                ProgressView()
                            }
                                .frame(width: 110, height: 110)
                                .clipShape(RoundedRectangle(cornerRadius: 10))

                        }
                        .frame(width: 130,height: 130)
                        .padding(.top, 30)
                        .padding(.leading, 20)
                        
                        //第二个
                        VStack(alignment: .leading){
                            Spacer()
                            HStack{
                                Text(artistName)
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.leading)
                                    .fontWeight(.bold)
                                    .font(.title3)
                                
                            }
//                            .padding(.top, 90)
                            .padding(.bottom, 10)
                            
                     
                            HStack{
                                VStack{
                                    Text(followers)
                                        .foregroundColor(.white)
                                        .multilineTextAlignment(.leading)
                                        .font(.system(size: 20))
                                    
                                }
                                VStack {
                                    Text("Followers")
                                        .foregroundColor(.white)
                                        .font(.system(size: 16))
                                    
                                }
                            }
//                            .padding(.top)
                            .padding(.bottom, 10)
                            
                            
                            HStack{
                                Link(destination: URL(string: spotifyLink)!) {
                                    Image("spotify")
                                        .resizable()
                                        .frame(width: 30, height: 30)
                                }
                                
                                
                                Text("Spotify")
                                    .foregroundColor(.green)
                            }
                            
                        }
                        .frame(width: 140,height: 120)
                        .padding(.leading, -15)
                        .padding(.top, 30)
                        
                        //第三个
                        VStack{
                            Text("Popularity")
                                .foregroundColor(.white)
                                .font(.system(size: 18))
                                .padding(.bottom)
//                                .padding(.top, 60)
                            ZStack {
                                Circle()
                                    .stroke(lineWidth: 13)
                                    .foregroundColor(Color.orange.opacity(0.3))
                                    .frame(width: 55, height: 55)
                                
                                Circle()
                                    .trim(from: 0.0, to: CGFloat(CGFloat(Int(popularity)!) * 0.01))
                                    .stroke(style: StrokeStyle(lineWidth: 13, lineCap: .butt, lineJoin: .round))
                                    .foregroundColor(Color.orange)
                                    .rotationEffect(Angle(degrees: 4))
                                    .frame(width: 55, height: 55)
                                
                                Text("\(popularity)")
                                    .font(.system(size: 20))
                                
                                    .foregroundColor(Color.white)
                            }
//                            .frame(width: 60, height: 60)
                        }
                        .frame(width: 100,height: 120)
                        .padding(.leading, -20)
                        .padding(.trailing)
                        .padding(.top, 30)
                    }
                    .padding(.bottom, 25)
                    
                    //三张图片
                    VStack(alignment: .leading ) {
                        HStack{
                            Text("Popular Album")
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .font(.title2)
                                .multilineTextAlignment(.leading)
                        }
                        .padding(-10)
                        .padding(.bottom, -20)
                        HStack {
                            VStack{
                                AsyncImage(url: URL(string: albumImage0)) { image in
                                    image.resizable()
                                } placeholder: {
                                    ProgressView()
                                }
                                    .frame(width: 90, height: 90)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    .padding(.leading, -30)
                            }
                            .frame(width: 100,height: 120)
                            VStack{
                                AsyncImage(url: URL(string: albumImage1)) { image in
                                    image.resizable()
                                } placeholder: {
                                    ProgressView()
                                }
                                    .frame(width: 90, height: 90)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    .padding(.leading, -5)

                            }
                            .frame(width: 100,height: 120)
                            VStack{
                                AsyncImage(url: URL(string: albumImage2)) { image in
                                    image.resizable()
                                } placeholder: {
                                    ProgressView()
                                }
                                    .frame(width: 90, height: 90)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                    .padding(.leading)

                            }
                            .frame(width: 100,height: 120)
                        }
                    }
                    
                    
                }
                .frame(width: 360, height: 310)
                .background(RoundedRectangle(cornerRadius: 20).fill(Color.black.opacity(0.8)))
                .padding(EdgeInsets(top: 10, leading: 10, bottom: 10, trailing: 10))
            }
        }
    }
}










struct ArtistsView_Previews: PreviewProvider {
    static var previews: some View {
        ArtistsView()
            .environmentObject(SearchViewModel())
    }
}
