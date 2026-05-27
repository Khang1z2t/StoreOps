package com.yunok.storeops.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @Value("${swagger.enabled:true}")
    private boolean swaggerEnabled;

    @GetMapping("/")
    public String root() {
        if (swaggerEnabled) {
            return "redirect:/swagger-ui.html";
        }
        return "redirect:https://portfolio.khangyuno.id.vn";
    }
}
