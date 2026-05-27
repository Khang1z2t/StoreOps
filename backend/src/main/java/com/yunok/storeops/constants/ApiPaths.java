package com.yunok.storeops.constants;

public final class ApiPaths {
    private ApiPaths() {
    }

    // ── Auth ─────────────────────────────────────
    public static final String API_AUTH = "/api/auth";
    public static final String AUTH_LOGIN = "/login";
    public static final String AUTH_REGISTER = "/register";
    public static final String AUTH_LOGOUT = "/logout";
    public static final String AUTH_ME = "/me";

    // ── Categories ───────────────────────────────
    public static final String API_CATEGORIES = "/api/categories";
    public static final String CATEGORY_BY_ID = "/{id}";

    // ── Products ─────────────────────────────────
    public static final String API_PRODUCTS = "/api/products";
    public static final String PRODUCT_BY_ID = "/{id}";

    // ── Orders ───────────────────────────────────
    public static final String API_ORDERS = "/api/orders";
    public static final String ORDER_BY_ID = "/{id}";
    public static final String ORDER_STATUS = "/{id}/status";
    public static final String ORDER_CANCEL = "/{id}/cancel";
    public static final String ORDER_MY = "/my";
}
