//
//  TestView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/13.
//

import SwiftUI

struct TestView: View {
    @ EnvironmentObject var searchViewModel: SearchViewModel
    
    var body: some View {
        VStack {
            //            Rectangle()
            //                .foregroundColor(Color.black.opacity(0.8)) // Set background color to a light black
            //                .frame(width: 360, height: 300) // Set fixed size for the rectangle
            //                .cornerRadius(10)
            //                .padding()
            VStack {
                HStack(alignment: .top){
                    VStack{
                        Image("facebook")
                            .resizable()
                            .frame(width: 100, height: 100)
                    }
                    .frame(width: 100,height: 100)
                    .padding(.leading)
                    
                    
                    VStack(alignment: .leading){
                        HStack{
                            Text("Ed Sheeran")
                                .foregroundColor(.white)
                                .multilineTextAlignment(.leading)
                                .fontWeight(.bold)
                                .font(.title3)
                            
                        }
                        .padding(.top)
                        .padding(.bottom)
                        
                        
                        HStack{
                            VStack{
                                Text("110M")
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.leading)
                                    .font(.system(size: 20))
                                
                            }
                            VStack {
                                Text("Followers")
                                    .foregroundColor(.white)
                                    .font(.system(size: 20))
                                
                            }
                        }
                        .padding(.bottom)

                        
                        HStack{
                            Image("spotify")
                                .resizable()
                                .frame(width: 40, height: 40)
                            
                            Text("Spotify")
                                .foregroundColor(.green)
                        }
                        
                    }
                    .frame(width: 140,height: 120)
                    .padding(.leading, 5)
                    
                    
                    VStack{
                        Text("Popularity")
                            .foregroundColor(.white)
                            .font(.title3)
                            .padding(.bottom)
                            .padding(.top, -10)
                        ZStack {
                            Circle()
                                .stroke(lineWidth: 15)
                                .foregroundColor(Color.orange.opacity(0.3))
                            
                            Circle()
                                .trim(from: 0.0, to: 93 * 0.01)
                                .stroke(style: StrokeStyle(lineWidth: 15, lineCap: .butt, lineJoin: .round))
                                .foregroundColor(Color.orange)
                                .rotationEffect(Angle(degrees: 4))
                            
                            Text("93")
                                .font(.system(size: 25))
                               
                                .foregroundColor(Color.white)
                        }
                        .frame(width: 60, height: 60)
                    }
                    .frame(width: 100,height: 120)
                    .padding(.trailing)
                    
                }
                .padding(.bottom, 50)
                
                
                VStack(alignment: .leading ) {
                    HStack{
                        Text("Popular Album")
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .font(.title)
                            .multilineTextAlignment(.leading)
                    }
                    .padding(-15)
                    
                    HStack {
                        VStack{
                            Image("facebook")
                                .resizable()
                                .frame(width: 80, height: 80)
                        }
                        .frame(width: 100,height: 120)
                        VStack{
                            Image("facebook")
                                .resizable()
                                .frame(width: 80, height: 80)
                        }
                        .frame(width: 100,height: 120)
                        VStack{
                            Image("facebook")
                                .resizable()
                                .frame(width: 80, height: 80)
                        }
                        .frame(width: 100,height: 120)
                    }
                }
                
                
            }
            .frame(width: 360, height: 340)
            .background(RoundedRectangle(cornerRadius: 20).fill(Color.black.opacity(0.8)))
            .padding(EdgeInsets(top: 10, leading: 10, bottom: 10, trailing: 10))
            
            
            
            VStack {
                HStack{
                    VStack{
                        Image("facebook")
                            .resizable()
                            .frame(width: 100, height: 120)
                    }
                    .frame(width: 100,height: 120)
                    VStack{
                        Image("facebook")
                            .resizable()
                            .frame(width: 40, height: 40)
                    }
                    .frame(width: 100,height: 120)
                    
                    VStack{
                        Image("facebook")
                            .resizable()
                            .frame(width: 40, height: 40)
                    }
                    .frame(width: 100,height: 120)
                    
                }
                .padding(30)
                
                VStack(alignment: .leading ) {
                    HStack{
                        Text("Popular Album")
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .font(.title)
                            .multilineTextAlignment(.leading)
                    }
                    
                    HStack {
                        VStack{
                            Image("facebook")
                                .resizable()
                                .frame(width: 40, height: 40)
                        }
                        .frame(width: 100,height: 120)
                        VStack{
                            Image("facebook")
                                .resizable()
                                .frame(width: 40, height: 40)
                        }
                        .frame(width: 100,height: 120)
                        VStack{
                            Image("facebook")
                                .resizable()
                                .frame(width: 40, height: 40)
                        }
                        .frame(width: 100,height: 120)
                    }
                }
                
                
            }
            .frame(width: 360, height: 320)
            .background(RoundedRectangle(cornerRadius: 20).fill(Color.black.opacity(0.8)))
            
            
            
        }
        Spacer()
    }
    
}

struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        TestView().environmentObject(SearchViewModel())
    }
}
