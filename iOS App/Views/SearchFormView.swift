//
//  SearchFormView.swift
//  hw9-code
//
//  Created by 火龙果 on 2023/4/10.
//

import SwiftUI
import Alamofire

struct SearchFormView: View {
    
    @EnvironmentObject var searchViewModel: SearchViewModel
    
    init () {
        
    }
    
    enum Categories: String, CaseIterable, Identifiable {
        var id: String {self.rawValue}
        
        case defaults = "Default"
        case music = "Music"
        case sports = "Sports"
        case arts = "Arts & Theatre"
        case film = "Film"
        case miscellaneous = "Miscellaneous"
    }
    
    @FocusState private var focused: Bool
    
    @State private var submit = false
    
    @State private var keyworod: String = ""
    
    @State private var distance: String = "10"
    
    @State private var category: String = "Default"
    @State private var location: String = ""
    @State private var autoDetect: Bool = false
    
    @State private var showProgessView: Bool = false;
    
//reference from chatGPT
    func isValidForm() -> Bool {
        if (!keyworod.isEmpty && !distance.isEmpty &&
            (!location.isEmpty || autoDetect)) {
            return true
        } else {
            return false
        }
    }
    
    func adaptivePresentationStyle(for controller: UIPresentationController, traitCollection: UITraitCollection) -> UIModalPresentationStyle {
        return .none
    }
    
    func submitForm() {
        
        searchViewModel.loading = true
        searchViewModel.getEvents(keyword: keyworod, radius: distance, category: category, location: location, autoDetect: autoDetect)
        submit = true
        hideKeyboard()
    }
    
//reference ends
    
    func clearForm() {
        
        keyworod = ""
        distance = "10"
        category = ""
        location = ""
        autoDetect = false
        searchViewModel.clear()
        hideKeyboard()
    }
    
    
    
    var body: some View {
        NavigationView {
            form
                .navigationBarTitle("Event Search")
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        NavigationLink(destination: {
                            FavoritesView()
                                .navigationTitle("Favorites")
                        }) {
                            Image(systemName: "heart.circle")
                                .foregroundColor(.blue)
                            
                        }
                    }
                }
            
        }
    }
    
    
    @State var showsPopover = false
    
    
    var form: some View {
//reference from chatGPT
        Form {
            Section {
                HStack {
                    Text("Keyword:").foregroundColor(.gray)
                    TextField("Required", text: $keyworod)
                        .onSubmit {
                            if keyworod.count > 0 {
                                showsPopover = true
                                searchViewModel.getAutoComplete(text: keyworod)
                            } else {
                                showsPopover = false
                                searchViewModel.autoComplete = [String]()
                            }
                        }
                        .popover(isPresented: $showsPopover) {
                            var loading = (searchViewModel.autoComplete.count == 0)
                            VStack {
                                if loading {
                                    ProgressView(label: {Text("loading...")})
                                        .frame(width: 500, height: 40)
                                } else {
                                    Text("Suggestions")
                                        .font(.title)
                                        .fontWeight(.bold)
                                        .multilineTextAlignment(.center)
                                    List(searchViewModel.autoComplete, id: \.self) {
                                        autoComp in
                                        Text(autoComp)
                                            .onTapGesture {
                                                showsPopover = false
                                                keyworod = autoComp
                                            }
                                            .foregroundColor(.black)
                                    }
                                }
                            }.padding()
                        }
                }
                
//reference ends
                HStack{
                    Text("Distance").foregroundColor(.gray)
                    TextField("Required", text: $distance)
                }
                
                HStack {
                    Text("Category:").foregroundColor(.gray)
                    Picker("", selection: $category) {
                        ForEach(Categories.allCases) { category in
                            Text(category.rawValue.capitalized).tag(category)
                        }
                    }
                    .foregroundColor(.gray)
                    .pickerStyle(.menu)
                }
                
                if !autoDetect {
                    HStack {
                        Text("Location").foregroundColor(.gray)
                        TextField("Required", text: $location)
                    }
                    .animation(.default)
                }
                
                Toggle(isOn: $autoDetect.animation(), label: {
                    HStack {
                        Text("Auto-detect my location")
                            .foregroundColor(.gray)
                    }
                })
                
                
                
                
                HStack{
                    Spacer()
                    
                    Button(action: {
                        submitForm()
                    }) {
                        HStack {
                            Spacer()
                            Text("Submit")
                            Spacer()
                        }
                    }
                    
                    .disabled(!isValidForm())
                    .frame(width: 120, height: 50, alignment: .center)
                    .foregroundColor(.white)
                    .background(isValidForm() ? .red : .gray)
                    .cornerRadius(8)
                    
                    Spacer()
                    
                    Button(action: {
                        clearForm()
                    }) {
                        HStack{
                            Spacer()
                            Text("Clear")
                            Spacer()
                        }
                    }
                    .frame(width: 120, height: 50, alignment: .center)
                    .foregroundColor(.white)
                    .background(isValidForm() ? .red : .gray)
                    .cornerRadius(8)
                    
                    Spacer()
                }
                .buttonStyle(BorderlessButtonStyle())
                .padding(10)
            }.onTapGesture {
                hideKeyboard()
            }
            .onAppear{
                
            }
            searchResults
        }
    }
    
    
    var searchResults: some View {
        List {
            if searchViewModel.loading || searchViewModel.loaded  {
                Text("Results")
                    .font(.title)
                    .fontWeight(.bold)
            }
            
            if (searchViewModel.loading) {
                //                HStack(alignment: .center) {
                //                    List {
                //                        //                        ProgressView(label: {Text("Please wait...")})
                //                        VStack{
                //                            ProgressView()
                //                            Text("Please wait...")
                //                                .foregroundColor(.gray)
                //                        }
                //                    }
                //                    .frame(maxWidth: .infinity, alignment: .center)
                //                }
                VStack {
                    
                    ProgressView()
                    Text("Please wait...")
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, alignment: .center)
            } else {
                if searchViewModel.loaded &&
                    searchViewModel.events.count == 0 {
                    List {
                        Text("No result available")
                            .foregroundColor(.red)
                    }
                } else {
                    List {
                        ForEach(0..<20) { i in
                            if searchViewModel.events.indices.contains(i) {
                                let event = searchViewModel.events[i]
                                NavigationLink(destination: DetailsTableView(id: searchViewModel.events[i].id!)
                                               //                                    .hiddenNavigationBarStyle()
                                ){
                                    eventItem(date: event.date!,
                                              event: event.name!,
                                              imageUrl: event.imageUrl!,
                                              venue: event.venue!,
                                              id: event.id!)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
//reference from chatGPT
    struct eventItem: View {
        let date: String
        let event: String
        let imageUrl: String
        let venue: String
        let id: String
        
        var body: some View {
            HStack{
                Text(date).foregroundColor(.gray)
                    .frame(width: 80.0)
                
                //                Spacer()
                AsyncImage(url: URL(string: imageUrl)) { image in
                    image.resizable()
                } placeholder: {
                    ProgressView()
                }
                .frame(width: 50, height: 50)
                .cornerRadius(5)
                
                //                Spacer()
                Text(event).fontWeight(.bold)
                    .padding(.horizontal)
                    .frame(width: 90.0)
                    .lineLimit(3)
                    .truncationMode(.tail)
                Spacer()
                
                //                Spacer()
                Text(venue).foregroundColor(.gray)
                    .frame(width: 50.0)
                    .lineLimit(3)
                    .truncationMode(.tail)
            }
        }
    }
}
//reference ends

struct SearchFormView_Previews: PreviewProvider {
    static var previews: some View {
        SearchFormView()
            .environmentObject(SearchViewModel())
    }
}
