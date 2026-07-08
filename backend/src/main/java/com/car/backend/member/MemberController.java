package com.car.backend.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/join")
    public String join(@RequestBody MemberDTO memberDTO) {
        int result = memberService.join(memberDTO);

        if (result > 0) {
            return "회원가입 성공";
        }

        return "회원가입 실패";
    }

    @GetMapping("/{loginId}")
    public MemberDTO findByLoginId(@PathVariable String loginId) {
        return memberService.findByLoginId(loginId);
    }
}