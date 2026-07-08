package com.car.backend.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDTO {

    private Long memberId;

    private String loginId;
    private String password;
    private String name;
    private String email;
    private String phone;

    private String memberType;
    private String status;

    private String preferredBrand;
    private String preferredModel;
    private String preferredFuel;
    private String preferredBodyType;
    private Integer preferredMinPrice;
    private Integer preferredMaxPrice;
}