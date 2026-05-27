package com.yunok.storeops.controller;

import com.yunok.storeops.constants.ApiPaths;
import com.yunok.storeops.dto.ApiResponse;
import com.yunok.storeops.dto.DashboardStatsResponse;
import com.yunok.storeops.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_DASHBOARD)
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping(ApiPaths.DASHBOARD_STATS)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", dashboardService.getStats()));
    }
}
