//
//  ViewController.swift
//  Cheater
//
//  Created by Kousha Ghodsizad on 3/26/23.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {

    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        webView = WKWebView(frame: view.bounds)
        webView.navigationDelegate = self
        view.addSubview(webView)

        print("start")
        
        if let url = URL(string: "https://chat.openai.com/chat") {
            webView.load(URLRequest(url: url))
            print("load web view")
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("script started.")
        
        if let path = Bundle.main.path(forResource: "script", ofType: "js") {
            do {
                print("read script file.");
                let script = try String(contentsOfFile: path)
                print("end script file.")
                
                print(script)
                
                webView.evaluateJavaScript(script) { result, error in
                    if let error = error {
                        print("Error evaluating JavaScript: \(error.localizedDescription)")
                    } else {
                        print("JavaScript result: \(String(describing: result))")
                    }
                }
            } catch {
                print("Error reading script file: \(error.localizedDescription)")
            }
        }
    }
}

